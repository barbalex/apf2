import { beforeAll, describe, expect, it } from 'vitest'

import {
  APP_ROLES,
  assertBackendAvailable,
  type Json,
  mintToken,
  pgrst,
} from './helpers.ts'

// the grant matrix the PostgREST migration relies on:
// - anon has nothing (deliberate, see sql/postgrest/queryTpop.sql)
// - every app role may execute the query_ RPCs the app reads through
// - table writes follow the grants: readers never write

describe('grants', () => {
  beforeAll(async () => {
    await assertBackendAvailable()
  })

  describe('anon has no access', () => {
    it('cannot read tables', async () => {
      const res = await pgrst('/ap?select=id&limit=1')
      expect(res.status).toBe(401)
      expect(res.data.message).toContain('permission denied for table ap')
    })

    it('cannot run query_ rpcs', async () => {
      const res = await pgrst('/rpc/query_tpop?select=id', {
        method: 'POST',
        body: { p_filter: {}, p_limit: 1 },
      })
      // this 401 with a 42501 body is what an unauthenticated browser
      // produced on production (#830 diagnosis)
      expect(res.status).toBe(401)
      expect(res.data.message).toContain('permission denied for function')
    })
  })

  describe('every app role runs the query_ rpcs', () => {
    for (const role of APP_ROLES) {
      it(`${role}: query_tpop`, async () => {
        const res = await pgrst('/rpc/query_tpop?select=id', {
          method: 'POST',
          token: mintToken(role, 'gabriel'),
          body: { p_filter: {}, p_limit: 1 },
        })
        expect(res.status).toBe(200)
      })
    }
  })

  describe('table writes follow the grants', () => {
    // a no-op PATCH (same value) on an existing tpop
    const patchTpop = async (token: string) => {
      const rows =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await pgrst('/tpop?select=id,nr&limit=1', { token })).data as Json[]
      const row = rows[0]
      if (!row) throw new Error('no tpop in dev db')
      return pgrst(`/tpop?id=eq.${row.id}`, {
        method: 'PATCH',
        token,
        body: { nr: row.nr },
      })
    }

    it('manager may update tpop', async () => {
      const res = await patchTpop(mintToken('apflora_manager', 'gabriel'))
      expect(res.status).toBe(204)
    })

    it('reader may not update tpop', async () => {
      const res = await patchTpop(mintToken('apflora_reader', 'gabriel'))
      expect(res.status).toBe(403)
      expect(res.data.message).toContain('permission denied for table tpop')
    })
  })
})
