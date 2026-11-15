import { beforeAll, describe, expect, it } from 'vitest'

import {
  assertBackendAvailable,
  getTestUser,
  mintToken,
  pgrst,
} from './helpers.ts'

// role matrix for apflora.saved_filter (linkable data filters):
// - everyone authenticated may read every saved filter
// - apflora_reader / apflora_ap_reader cannot write (grant level: 403)
// - apflora_ap_writer / apflora_freiwillig / apflora_manager may create;
//   id, created_at and created_by are forced server-side
// - overwriting/deleting is the owner's (or a manager's) alone. RLS
//   hides foreign rows from UPDATE/DELETE, which PostgREST reports as a
//   silent no-op (204, zero affected rows) — asserted via
//   return=representation and re-reads, not via the status code

// no apflora_ap_reader users exist in the dev db; the username claim is
// what RLS keys off, so fixed names suffice (same approach as
// rls-matrix.test.ts)
const readerName = 'Gast'
const apReaderName = 'gabriel'
const freiwilligName = 'Tester'
const managerName = 'gabriel'

beforeAll(async () => {
  await assertBackendAvailable()
})

const filterBody = {
  name: 'test-filter',
  filter: { ap: [{ startJahr: 2020 }] },
}

describe('saved_filter', () => {
  it('lets every authenticated role list and read filters', async () => {
    const writer = getTestUser('apflora_ap_writer')
    const cases = [
      ['apflora_reader', readerName],
      ['apflora_ap_reader', apReaderName],
      ['apflora_ap_writer', writer.name],
      ['apflora_freiwillig', freiwilligName],
      ['apflora_manager', managerName],
    ] as const
    for (const [role, name] of cases) {
      const { status } = await pgrst('/saved_filter?select=id', {
        token: mintToken(role, name),
      })
      expect(status, role).toBe(200)
    }
  })

  it('refuses anonymous reads', async () => {
    const { status } = await pgrst('/saved_filter?select=id')
    expect([401, 403]).toContain(status)
  })

  it('refuses to let readers create filters (grant level)', async () => {
    const cases = [
      ['apflora_reader', readerName],
      ['apflora_ap_reader', apReaderName],
    ] as const
    for (const [role, name] of cases) {
      const { status } = await pgrst('/saved_filter', {
        method: 'POST',
        token: mintToken(role, name),
        body: [filterBody],
      })
      expect([401, 403], role).toContain(status)
    }
  })

  it('lets writing roles create filters with server-forced attribution', async () => {
    const writer = getTestUser('apflora_ap_writer')
    const cases = [
      ['apflora_ap_writer', writer.name],
      ['apflora_freiwillig', freiwilligName],
      ['apflora_manager', managerName],
    ] as const
    for (const [role, name] of cases) {
      const { status, data } = await pgrst('/saved_filter', {
        method: 'POST',
        token: mintToken(role, name),
        body: [
          {
            ...filterBody,
            // spoofed attribution must be ignored
            name: `test-filter-${role}`,
            id: '00000000-0000-0000-0000-000000000000',
            created_by: 'someone-else',
          },
        ],
        prefer: 'return=representation',
      })
      expect(status, role).toBe(201)
      expect(data[0].created_by, role).toBe(name)
      expect(data[0].name, role).toBe(`test-filter-${role}`)
      expect(data[0].id, role).not.toBe('00000000-0000-0000-0000-000000000000')
    }
  })

  it('lets only the owner (or a manager) update and delete', async () => {
    const writer = getTestUser('apflora_ap_writer')
    const writerToken = mintToken('apflora_ap_writer', writer.name)
    const { data: created } = await pgrst('/saved_filter', {
      method: 'POST',
      token: writerToken,
      body: [{ name: 'test-filter-owner', filter: filterBody.filter }],
      prefer: 'return=representation',
    })
    const id = created[0].id

    // another filter-writing user cannot update the foreign row: RLS
    // hides it from the UPDATE, so no rows come back
    const patch = await pgrst(`/saved_filter?id=eq.${id}`, {
      method: 'PATCH',
      token: mintToken('apflora_freiwillig', freiwilligName),
      body: { name: 'hijacked' },
      prefer: 'return=representation',
    })
    expect(patch.data.length).toBe(0)

    // nor delete it: the row survives
    await pgrst(`/saved_filter?id=eq.${id}`, {
      method: 'DELETE',
      token: mintToken('apflora_freiwillig', freiwilligName),
    })
    const { data: afterForeignDelete } = await pgrst(
      `/saved_filter?id=eq.${id}&select=name`,
      { token: writerToken },
    )
    expect(afterForeignDelete.length).toBe(1)
    expect(afterForeignDelete[0].name).toBe('test-filter-owner')

    // the owner can update; created_at/created_by stay pinned
    const ownPatch = await pgrst(`/saved_filter?id=eq.${id}`, {
      method: 'PATCH',
      token: writerToken,
      body: { name: 'test-filter-owner-2', created_by: 'someone-else' },
      prefer: 'return=representation',
    })
    expect(ownPatch.data.length).toBe(1)
    expect(ownPatch.data[0].name).toBe('test-filter-owner-2')
    expect(ownPatch.data[0].created_by).toBe(writer.name)

    // a manager can delete someone else's filter
    const managerDelete = await pgrst(`/saved_filter?id=eq.${id}`, {
      method: 'DELETE',
      token: mintToken('apflora_manager', managerName),
      prefer: 'return=representation',
    })
    expect(managerDelete.status).toBe(200)
    expect(managerDelete.data.length).toBe(1)
  })

  it('cleans up the filters created by these tests', async () => {
    const token = mintToken('apflora_manager', managerName)
    const { data } = await pgrst(
      '/saved_filter?select=id&name=like.test-filter*',
      { token },
    )
    for (const row of data ?? []) {
      await pgrst(`/saved_filter?id=eq.${row.id}`, {
        method: 'DELETE',
        token,
      })
    }
  })
})
