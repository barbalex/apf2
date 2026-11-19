import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  assertBackendAvailable,
  mintToken,
  pgrst,
  psql,
  psqlJson,
} from './helpers.ts'

// Issue 847: der DB-Trigger tpopmassn_set_zieleinheit leitet
// zieleinheit_einheit/zieleinheit_anzahl von Anpflanzungen ab — für jeden
// Schreibweg (Formular, Kopieren, API), nicht mehr nur für das Formular.
// Diese Tests schreiben als apflora_ap_writer über PostgREST wie die App.

type Row = {
  typ: number | null
  anz_triebe: number | null
  zieleinheit_einheit: number | null
  zieleinheit_anzahl: number | null
}

describe('tpopmassn zieleinheit trigger (#847)', () => {
  beforeAll(async () => {
    await assertBackendAvailable()
  })

  // ein Writer mit einer zugewiesenen Art, deren zielrelevante Zähleinheit
  // anz_triebe entspricht (und ohne not_massn_count_unit)
  let writerName: string
  let fixture: { tpopId: string; einheitCode: number }
  beforeAll(() => {
    const rows = psqlJson<{
      user_name: string
      tpop_id: string
      w_code: number
    }>(
      `select au.user_name, t.id as tpop_id, w.code as w_code
         from apflora."user" u
         join apflora.ap_user au on au.user_name = u.name
         join apflora.pop p on p.ap_id = au.ap_id
         join apflora.tpop t on t.pop_id = p.id
         join apflora.ekzaehleinheit e
           on e.ap_id = au.ap_id and e.zielrelevant = true
         join apflora.tpopkontrzaehl_einheit_werte w
           on w.id = e.zaehleinheit_id
        where u.role = 'apflora_ap_writer'
          and w.corresponds_to_massn_anz_triebe = true
          and coalesce(e.not_massn_count_unit, false) = false
        limit 1`,
    )
    if (!rows.length) {
      throw new Error(
        'no ap_writer with a triebe-corresponding zielrelevanten Zähleinheit',
      )
    }
    writerName = rows[0].user_name
    fixture = { tpopId: rows[0].tpop_id, einheitCode: rows[0].w_code }
  })

  afterAll(() => {
    // cleanup regardless of test outcome
    psql(`delete from apflora.tpopmassn where id::text like 'a8470000-%'`)
  })

  const massnId = 'a8470000-0000-4000-8000-000000000001'
  const massn2Id = 'a8470000-0000-4000-8000-000000000002'
  const token = () => mintToken('apflora_ap_writer', writerName)

  const fetchRow = async (id: string): Promise<Row> => {
    const res = await pgrst(
      `/tpopmassn?id=eq.${id}&select=typ,anz_triebe,zieleinheit_einheit,zieleinheit_anzahl`,
      { token: token() },
    )
    expect(res.status).toBe(200)
    return (res.data as Row[])[0]
  }

  it('sets einheit and anzahl on insert of an Anpflanzung', async () => {
    const res = await pgrst('/tpopmassn', {
      method: 'POST',
      token: token(),
      body: {
        id: massnId,
        tpop_id: fixture.tpopId,
        typ: 2,
        jahr: 2026,
        anz_triebe: 7,
      },
    })
    expect(res.status).toBe(201)
    const row = await fetchRow(massnId)
    expect(row.zieleinheit_einheit).toBe(fixture.einheitCode)
    expect(row.zieleinheit_anzahl).toBe(7)
  })

  it('lets anzahl follow anz_triebe', async () => {
    const res = await pgrst(`/tpopmassn?id=eq.${massnId}`, {
      method: 'PATCH',
      token: token(),
      body: { anz_triebe: 9 },
    })
    expect(res.status).toBe(204)
    const row = await fetchRow(massnId)
    expect(row.zieleinheit_anzahl).toBe(9)
  })

  it('keeps manually set anzahl through unrelated saves', async () => {
    await pgrst(`/tpopmassn?id=eq.${massnId}`, {
      method: 'PATCH',
      token: token(),
      body: { zieleinheit_anzahl: 100 },
    })
    await pgrst(`/tpopmassn?id=eq.${massnId}`, {
      method: 'PATCH',
      token: token(),
      body: { bemerkungen: 'unrelated save' },
    })
    const row = await fetchRow(massnId)
    expect(row.zieleinheit_anzahl).toBe(100)
  })

  it('re-derives on typ change to an Anpflanzung typ', async () => {
    // away from anpflanzung: values stay (the form hides them)
    await pgrst(`/tpopmassn?id=eq.${massnId}`, {
      method: 'PATCH',
      token: token(),
      body: { typ: 40 },
    })
    expect((await fetchRow(massnId)).zieleinheit_anzahl).toBe(100)
    // and back: derived anew, replacing the manual value
    await pgrst(`/tpopmassn?id=eq.${massnId}`, {
      method: 'PATCH',
      token: token(),
      body: { typ: 2 },
    })
    const row = await fetchRow(massnId)
    expect(row.zieleinheit_einheit).toBe(fixture.einheitCode)
    expect(row.zieleinheit_anzahl).toBe(9)
  })

  it('derives when typ is set after insert (the form flow)', async () => {
    // new massnahmen are inserted without typ; the form sets it afterwards
    const res = await pgrst('/tpopmassn', {
      method: 'POST',
      token: token(),
      body: { id: massn2Id, tpop_id: fixture.tpopId },
    })
    expect(res.status).toBe(201)
    expect((await fetchRow(massn2Id)).zieleinheit_einheit).toBeNull()
    await pgrst(`/tpopmassn?id=eq.${massn2Id}`, {
      method: 'PATCH',
      token: token(),
      body: { typ: 2, anz_triebe: 5 },
    })
    const row = await fetchRow(massn2Id)
    expect(row.zieleinheit_einheit).toBe(fixture.einheitCode)
    expect(row.zieleinheit_anzahl).toBe(5)
  })

  it('backs the backfill: no anpflanzung row stays derivably empty', async () => {
    // the one-off backfill (02_backfill.sql) plus the trigger should leave
    // no row where einheit matches the zielrelevante Zähleinheit, its
    // korrespondenz-value is set, but anzahl is missing
    const rows = psqlJson<{ count: string }>(
      `select count(*) as count
         from apflora.tpopmassn m
         join apflora.tpopmassn_typ_werte tw on tw.code = m.typ and tw.anpflanzung = true
         join apflora.tpop t on t.id = m.tpop_id
         join apflora.pop p on p.id = t.pop_id
         join apflora.ap a on a.id = p.ap_id
         join apflora.ekzaehleinheit e on e.ap_id = a.id and e.zielrelevant = true
         join apflora.tpopkontrzaehl_einheit_werte w on w.id = e.zaehleinheit_id
        where coalesce(e.not_massn_count_unit, false) = false
          and m.zieleinheit_einheit = w.code
          and m.zieleinheit_anzahl is null
          and ((w.corresponds_to_massn_anz_triebe = true and m.anz_triebe is not null)
            or (w.corresponds_to_massn_anz_pflanzen = true and m.anz_pflanzen is not null))`,
    )
    expect(Number(rows[0].count)).toBe(0)
  })
})
