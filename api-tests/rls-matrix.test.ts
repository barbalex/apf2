import { beforeAll, describe, expect, it } from 'vitest'

import {
  assertBackendAvailable,
  getTestUser,
  mintToken,
  pgrst,
  psqlJson,
  type Json,
} from './helpers.ts'

// systematic role x table x action matrix for the main writable hierarchy
// tables, complementing rls.test.ts (which covers ap/tpop scoping in
// depth) and grants.test.ts (single-table grant checks):
// - readers (apflora_reader, apflora_ap_reader) never write (grant level)
// - apflora_freiwillig writes only its EKF tables (grant level)
// - apflora_ap_writer no-op-updates any row INSIDE its assigned aps
//   and is refused by RLS on rows OUTSIDE them
// - apflora_manager writes everywhere

type MatrixTable = {
  label: string
  endpoint: string
  // sql returning { id, val } for one row of this table whose ap is
  // inside (or outside) the given set of assigned aps
  rowSql: (assigned: string) => string
  patchColumn: string
  // apflora_freiwillig normally has no grant on these tables. EXCEPTION
  // tpopkontr: the reader-policy's with_check lets freiwillig update ANY
  // tpopkontr row — the policy cannot distinguish Freiwilligen-Kontrollen
  // from professional Kontrollen. Broad, but deliberate as of today; the
  // app UI only exposes freiwkontr editing to volunteers.
  freiwilligMayPatch?: boolean
}

const tables: MatrixTable[] = [
  {
    label: 'ap',
    endpoint: 'ap',
    rowSql: (assigned) => `select id, start_jahr as val
        from apflora.ap where id ${assigned} limit 1`,
    patchColumn: 'start_jahr',
  },
  {
    label: 'pop',
    endpoint: 'pop',
    rowSql: (assigned) => `select p.id, p.nr as val
        from apflora.pop p where p.ap_id ${assigned} limit 1`,
    patchColumn: 'nr',
  },
  {
    label: 'tpop',
    endpoint: 'tpop',
    rowSql: (assigned) => `select t.id, t.nr as val
        from apflora.tpop t
        join apflora.pop p on p.id = t.pop_id
        where p.ap_id ${assigned} limit 1`,
    patchColumn: 'nr',
  },
  {
    // Freiwilligen-Kontrollen live in the same table and have their own
    // rules (see freiwillig.test.ts)
    label: 'tpopkontr (Feldkontrolle)',
    endpoint: 'tpopkontr',
    rowSql: (assigned) => `select k.id, k.jahr as val
        from apflora.tpopkontr k
        join apflora.tpop t on t.id = k.tpop_id
        join apflora.pop p on p.id = t.pop_id
        where k.typ in ('Kontrolle', 'Ausgangszustand') and p.ap_id ${assigned} limit 1`,
    patchColumn: 'jahr',
    freiwilligMayPatch: true,
  },
  {
    label: 'tpopmassn',
    endpoint: 'tpopmassn',
    rowSql: (assigned) => `select m.id, m.jahr as val
        from apflora.tpopmassn m
        join apflora.tpop t on t.id = m.tpop_id
        join apflora.pop p on p.id = t.pop_id
        where p.ap_id ${assigned} limit 1`,
    patchColumn: 'jahr',
  },
  {
    label: 'erfkrit',
    endpoint: 'erfkrit',
    rowSql: (assigned) => `select e.id, e.erfolg as val
        from apflora.erfkrit e
        where e.ap_id ${assigned} limit 1`,
    patchColumn: 'erfolg',
  },
  {
    label: 'apber',
    endpoint: 'apber',
    rowSql: (assigned) => `select b.id, b.jahr as val
        from apflora.apber b where b.ap_id ${assigned} limit 1`,
    patchColumn: 'jahr',
  },
]

describe('rls matrix: role x table x no-op update', () => {
  beforeAll(async () => {
    await assertBackendAvailable()
  })

  const writer = getTestUser('apflora_ap_writer')
  const writerToken = () => mintToken('apflora_ap_writer', writer.name)
  const inAps = `(select ap_id from apflora.ap_user where user_name = '${writer.name}')`

  const rowFor = (table: MatrixTable, inside: boolean) => {
    const rows = psqlJson<{ id: string; val: number | null }>(
      table.rowSql(inside ? `in ${inAps}` : `not in ${inAps}`),
    )
    if (!rows.length) {
      throw new Error(
        `no ${inside ? 'inside' : 'outside'} row for ${table.label} in dev db`,
      )
    }
    return rows[0]
  }

  const noOpPatch = (
    table: MatrixTable,
    row: { id: string; val: number | null },
    token: string,
  ) =>
    pgrst(`/${table.endpoint}?id=eq.${row.id}`, {
      method: 'PATCH',
      token,
      body: { [table.patchColumn]: row.val },
    })

  for (const table of tables) {
    describe(table.label, () => {
      it('apflora_reader is refused (grant)', async () => {
        const res = await noOpPatch(
          table,
          rowFor(table, true),
          mintToken('apflora_reader', 'gabriel'),
        )
        expect(res.status).toBe(403)
      })

      it('apflora_ap_reader is refused (grant)', async () => {
        const res = await noOpPatch(
          table,
          rowFor(table, true),
          mintToken('apflora_ap_reader', 'gabriel'),
        )
        expect(res.status).toBe(403)
      })

      it('apflora_freiwillig is refused (grant)', async () => {
        const res = await noOpPatch(
          table,
          rowFor(table, true),
          mintToken('apflora_freiwillig', 'Tester'),
        )
        // see MatrixTable.freiwilligMayPatch for the tpopkontr exception
        expect(res.status).toBe(table.freiwilligMayPatch ? 204 : 403)
      })

      it('apflora_ap_writer updates a row inside its assigned aps', async () => {
        const res = await noOpPatch(table, rowFor(table, true), writerToken())
        expect(res.status).toBe(204)
      })

      it('apflora_ap_writer is refused by RLS outside its assigned aps', async () => {
        const res = await noOpPatch(table, rowFor(table, false), writerToken())
        expect(res.status).toBe(403)
        expect((res.data as Json).message).toContain(
          'row-level security policy',
        )
      })

      it('apflora_manager updates any row', async () => {
        const res = await noOpPatch(
          table,
          rowFor(table, true),
          mintToken('apflora_manager', 'gabriel'),
        )
        expect(res.status).toBe(204)
      })
    })
  }
})
