import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  assertBackendAvailable,
  type Json,
  mintToken,
  pgrst,
  psql,
  psqlJson,
} from './helpers.ts'

// freiwillige have their own UI to edit their EKF-Kontrollen. they hold
// full grants on tpopkontr / tpopkontrzaehl / tpopkontr_file /
// usermessage (and SELECT on the q_ views they read), but no access to
// the other tables. On tpopkontr, RLS restricts them to their OWN
// Freiwilligen-Kontrollen: bearbeiter must be the adresse linked to
// their user account (INSERT may leave bearbeiter NULL — the app creates
// them unassigned). jahr 2999 marks the rows this test creates.
describe('freiwillig EKF editing', () => {
  const token = mintToken('apflora_freiwillig', 'Tester')
  const markerJahr = 2999

  let tpopId: string
  let kontrId: string | undefined
  let adresseId: string
  let ownKontrId: string
  let foreignKontr: { id: string; jahr: number }
  let einheit: number

  beforeAll(() => {
    ;[tpopId] = psqlJson<{ id: string }>(
      'select id from apflora.tpop limit 1',
    ).map((r) => r.id)
    ;[einheit] = psqlJson<{ code: number }>(
      'select code from apflora.tpopkontrzaehl_einheit_werte limit 1',
    ).map((r) => r.code)

    // seed the adresse that makes 'Tester' own Freiwilligen-Kontrollen
    // (psqlJson wraps sql in a from (…) subquery — inserts go through
    // plain psql, ids are read back with a select)
    psql(
      `insert into apflora.adresse (name) values ('api-test-freiwillig-adresse')`,
    )
    ;[adresseId] = psqlJson<{ id: string }>(
      `select id from apflora.adresse where name = 'api-test-freiwillig-adresse'`,
    ).map((r) => r.id)
    psql(
      `update apflora."user" set adresse_id = '${adresseId}' where name = 'Tester'`,
    )
    psql(
      `insert into apflora.tpopkontr (tpop_id, jahr, typ, bearbeiter)
       values ('${tpopId}', ${markerJahr}, 'Freiwilligen-Kontrolle', '${adresseId}')`,
    )
    ;[ownKontrId] = psqlJson<{ id: string }>(
      `select id from apflora.tpopkontr
        where tpop_id = '${tpopId}' and jahr = ${markerJahr} and bearbeiter = '${adresseId}'`,
    ).map((r) => r.id)
    ;[foreignKontr] = psqlJson<{ id: string; jahr: number }>(
      `select id, jahr from apflora.tpopkontr
        where typ in ('Kontrolle', 'Ausgangszustand') limit 1`,
    )
  })

  afterAll(() => {
    psql(
      `delete from apflora.tpopkontrzaehl
         where tpopkontr_id in (select id from apflora.tpopkontr
                                 where tpop_id = '${tpopId}'
                                   and jahr = ${markerJahr});
       delete from apflora.tpopkontr
        where tpop_id = '${tpopId}' and jahr = ${markerJahr};
       update apflora."user" set adresse_id = null where name = 'Tester';
       delete from apflora.adresse where id = '${adresseId}'`,
    )
  })

  it('reads tpopkontr and the q_ views', async () => {
    const kontr = await pgrst('/tpopkontr?select=id,jahr&limit=1', { token })
    expect(kontr.status).toBe(200)
    const tpop = await pgrst('/q_tpop?select=id&limit=1', { token })
    expect(tpop.status).toBe(200)
  })

  it('updates its own Freiwilligen-Kontrolle', async () => {
    const res = await pgrst(`/tpopkontr?id=eq.${ownKontrId}`, {
      method: 'PATCH',
      token,
      body: { jahr: markerJahr },
    })
    expect(res.status).toBe(204)
  })

  it('may not update a professional Kontrolle', async () => {
    const res = await pgrst(`/tpopkontr?id=eq.${foreignKontr.id}`, {
      method: 'PATCH',
      token,
      body: { jahr: foreignKontr.jahr },
    })
    expect(res.status).toBe(403)
  })

  it('may not create a professional Kontrolle', async () => {
    const res = await pgrst('/tpopkontr?select=id', {
      method: 'POST',
      token,
      body: { tpop_id: tpopId, jahr: markerJahr, typ: 'Kontrolle' },
    })
    expect(res.status).toBe(403)
  })

  it('may not add a zaehl to a professional Kontrolle', async () => {
    const res = await pgrst('/tpopkontrzaehl', {
      method: 'POST',
      token,
      body: { tpopkontr_id: foreignKontr.id, einheit, anzahl: 1 },
    })
    expect(res.status).toBe(403)
  })

  it('creates an own Freiwilligen-Kontrolle with a zaehl and removes it again', async () => {
    const inserted = await pgrst('/tpopkontr?select=id', {
      method: 'POST',
      token,
      prefer: 'return=representation',
      body: {
        tpop_id: tpopId,
        jahr: markerJahr,
        typ: 'Freiwilligen-Kontrolle',
        bearbeiter: adresseId,
      },
    })
    expect(inserted.status).toBe(201)
    kontrId = (inserted.data as Json[])[0].id

    const zaehl = await pgrst('/tpopkontrzaehl', {
      method: 'POST',
      token,
      body: { tpopkontr_id: kontrId, einheit, anzahl: 1 },
    })
    expect(zaehl.status).toBe(201)

    const deleted = await pgrst(`/tpopkontr?id=eq.${kontrId}`, {
      method: 'DELETE',
      token,
    })
    expect(deleted.status).toBe(204)
    // the zaehl went with its kontr
    const orphaned = psqlJson<{ count: number }>(
      `select count(*)::int as count from apflora.tpopkontrzaehl
        where tpopkontr_id = '${kontrId}'`,
    )[0].count
    expect(orphaned).toBe(0)
    kontrId = undefined
  })

  it('cannot update tpop', async () => {
    const rows =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (await pgrst('/tpop?select=id,nr&limit=1', { token })).data as Json[]
    const res = await pgrst(`/tpop?id=eq.${rows[0].id}`, {
      method: 'PATCH',
      token,
      body: { nr: rows[0].nr },
    })
    expect(res.status).toBe(403)
  })
})
