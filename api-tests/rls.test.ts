import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  assertBackendAvailable,
  getTestUser,
  type Json,
  mintToken,
  pgrst,
  psql,
  psqlJson,
} from './helpers.ts'

// the RLS policies scope apflora_ap_reader and apflora_ap_writer to the
// aps assigned in apflora.ap_user (matched via the token's username
// claim, which current_user_name() reads):
// - ap_reader SEES only assigned aps (and their tpops)
// - ap_writer sees everything but WRITES only within assigned aps
// - manager sees and writes everything

describe('row level security', () => {
  beforeAll(async () => {
    await assertBackendAvailable()
  })

  describe('ap_writer writes only within assigned aps', () => {
    const writer = getTestUser('apflora_ap_writer')
    const token = () => mintToken('apflora_ap_writer', writer.name)

    // one tpop inside and one outside the writer's assigned aps, with
    // its current nr for no-op PATCHes
    let inside: { id: string; nr: number }
    let outside: { id: string; nr: number }

    beforeAll(() => {
      const rows = psqlJson<{ id: string; nr: number }>(
        `select t.id, t.nr
           from apflora.tpop t
           join apflora.pop p on p.id = t.pop_id
          where p.ap_id in (select ap_id from apflora.ap_user
                             where user_name = '${writer.name}')
          limit 1`,
      )
      if (!rows.length) throw new Error(`no assigned aps for ${writer.name}`)
      inside = rows[0]
      const outRows = psqlJson<{ id: string; nr: number }>(
        `select t.id, t.nr
           from apflora.tpop t
           join apflora.pop p on p.id = t.pop_id
          where p.ap_id not in (select ap_id from apflora.ap_user
                                 where user_name = '${writer.name}')
          limit 1`,
      )
      outside = outRows[0]
    })

    it('sees all aps', async () => {
      const res = await pgrst('/ap?select=id&limit=1000', { token: token() })
      expect(res.status).toBe(200)
      const managerRows =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await pgrst('/ap?select=id&limit=1000', {
          token: mintToken('apflora_manager', 'gabriel'),
        })).data as Json[]
      expect((res.data as Json[]).length).toBe(managerRows.length)
    })

    it('may update a tpop inside its aps', async () => {
      const res = await pgrst(`/tpop?id=eq.${inside.id}`, {
        method: 'PATCH',
        token: token(),
        body: { nr: inside.nr },
      })
      expect(res.status).toBe(204)
    })

    it('may not update a tpop outside its aps', async () => {
      const res = await pgrst(`/tpop?id=eq.${outside.id}`, {
        method: 'PATCH',
        token: token(),
        body: { nr: outside.nr },
      })
      expect(res.status).toBe(403)
      expect(res.data.message).toContain(
        'new row violates row-level security policy',
      )
    })
  })

  describe('ap_reader sees only assigned aps', () => {
    // the dev db has no apflora_ap_reader at all - seed a dedicated
    // user with two ap assignments, and remove it all afterwards
    const readerName = 'api-test-ap-reader'
    const token = () => mintToken('apflora_ap_reader', readerName)
    const seededApIds: string[] = []

    beforeAll(() => {
      psql(
        `insert into apflora."user" (name, pass, role)
         values ('${readerName}', crypt('api-test', gen_salt('bf')),
                 'apflora_ap_reader')`,
      )
      seededApIds.push(
        ...psqlJson<{ id: string }>(
          'select id from apflora.ap order by id limit 2',
        ).map((r) => r.id),
      )
      for (const apId of seededApIds) {
        psql(
          `insert into apflora.ap_user (ap_id, user_name)
           values ('${apId}', '${readerName}')`,
        )
      }
    })

    afterAll(() => {
      psql(`delete from apflora.ap_user where user_name = '${readerName}'`)
      psql(`delete from apflora."user" where name = '${readerName}'`)
    })

    it('sees exactly the assigned aps', async () => {
      const res = await pgrst('/ap?select=id', { token: token() })
      expect(res.status).toBe(200)
      const seen = (res.data as Json[]).map((r) => r.id).sort()
      expect(seen).toEqual([...seededApIds].sort())
    })

    it('sees only tpops of the assigned aps', async () => {
      const res = await pgrst('/tpop?select=id&limit=100000', {
        token: token(),
      })
      expect(res.status).toBe(200)
      const expected = psqlJson<{ count: number }>(
        `select count(*)::int as count
           from apflora.tpop t
           join apflora.pop p on p.id = t.pop_id
          where p.ap_id in (${seededApIds.map((id) => `'${id}'`).join(',')})`,
      )[0].count
      expect((res.data as Json[]).length).toBe(expected)
      expect(expected).toBeGreaterThan(0)
    })

    it('may not write at all', async () => {
      const rows =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (await pgrst('/tpop?select=id,nr&limit=1', { token: token() }))
          .data as Json[]
      const res = await pgrst(`/tpop?id=eq.${rows[0].id}`, {
        method: 'PATCH',
        token: token(),
        body: { nr: rows[0].nr },
      })
      expect(res.status).toBe(403)
    })
  })
})
