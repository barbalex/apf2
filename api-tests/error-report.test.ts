import { afterAll, describe, expect, it } from 'vitest'

import { assertBackendAvailable, mintToken, pgrst, psql } from './helpers.ts'

// the error telemetry collector: the opt-in client reporter
// (src/modules/errorTelemetry.ts, unit-tested there) posts one JSON object
// per client error. The table accepts anonymous inserts of exactly that
// shape (capped, id/created_at forced server-side) and is readable only
// by apflora_manager.
describe('error_report collector', () => {
  afterAll(() => {
    psql(`delete from apflora.error_report where release = '0.0.0-test'`)
  })

  it('accepts an anonymous insert with the client payload shape', async () => {
    // exactly the wire format of src/modules/errorTelemetry.ts:
    // no timestamp (created_at is server-side), user_agent snake_case
    const res = await pgrst('/error_report', {
      method: 'POST',
      body: {
        release: '0.0.0-test',
        kind: 'manual',
        message: 'boom',
        stack: 'Error: boom\n    at chunk.js:1:2',
        url: '/Daten/Projekte',
        user_agent: 'vitest',
      },
    })
    expect(res.status).toBe(201)
  })

  it('forces id and created_at server-side', async () => {
    const res = await pgrst('/error_report', {
      method: 'POST',
      body: {
        id: '00000000-0000-0000-0000-000000000000',
        created_at: '2000-01-01T00:00:00Z',
        release: '0.0.0-test',
        kind: 'boundary',
        message: 'x',
      },
    })
    expect(res.status).toBe(201)

    const row = psql(
      `select id::text, created_at::text from apflora.error_report
        where release = '0.0.0-test' and kind = 'boundary' limit 1`,
    )
    expect(row).not.toContain('00000000-0000-0000-0000-000000000000')
    expect(row).not.toContain('2000-01-01')
  })

  it('rejects payloads violating the caps or the kind enum', async () => {
    const tooLong = await pgrst('/error_report', {
      method: 'POST',
      body: {
        release: '0.0.0-test',
        kind: 'manual',
        message: 'a'.repeat(2001),
      },
    })
    expect(tooLong.status).toBe(400)

    const badKind = await pgrst('/error_report', {
      method: 'POST',
      body: { release: '0.0.0-test', kind: 'made-up', message: 'a' },
    })
    expect(badKind.status).toBe(400)
  })

  it('is not readable anonymously', async () => {
    const res = await pgrst('/error_report?select=id&limit=1')
    expect(res.status).toBe(401)
    expect(res.data.message).toContain(
      'permission denied for table error_report',
    )
  })

  it('is readable by apflora_manager', async () => {
    const res = await pgrst('/error_report?select=id,kind&limit=1000', {
      token: mintToken('apflora_manager', 'gabriel'),
    })
    expect(res.status).toBe(200)
    const rows = res.data as { kind: string }[]
    expect(rows.some((r) => r.kind === 'manual')).toBe(true)
  })
})
