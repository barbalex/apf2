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
// the other tables. jahr 2999 marks the rows this test creates.
describe('freiwillig EKF editing', () => {
  const token = mintToken('apflora_freiwillig', 'Tester')
  const markerJahr = 2999

  let tpopId: string
  let kontrId: string | undefined
  // typ references tpopkontr_typ_werte(text), not its code
  let typ: string
  let einheit: number
  let existingKontr: { id: string; jahr: number }

  beforeAll(() => {
    ;[tpopId] = psqlJson<{ id: string }>(
      'select id from apflora.tpop limit 1',
    ).map((r) => r.id)
    ;[typ] = psqlJson<{ text: string }>(
      'select text from apflora.tpopkontr_typ_werte order by sort limit 1',
    ).map((r) => r.text)
    ;[einheit] = psqlJson<{ code: number }>(
      'select code from apflora.tpopkontrzaehl_einheit_werte limit 1',
    ).map((r) => r.code)
  })

  afterAll(() => {
    psql(
      `delete from apflora.tpopkontrzaehl
         where tpopkontr_id in (select id from apflora.tpopkontr
                                 where tpop_id = '${tpopId}'
                                   and jahr = ${markerJahr});
       delete from apflora.tpopkontr
        where tpop_id = '${tpopId}' and jahr = ${markerJahr}`,
    )
  })

  it('reads tpopkontr and the q_ views', async () => {
    const kontr = await pgrst('/tpopkontr?select=id,jahr&limit=1', { token })
    expect(kontr.status).toBe(200)
    existingKontr = (kontr.data as Json[])[0]
    const tpop = await pgrst('/q_tpop?select=id&limit=1', { token })
    expect(tpop.status).toBe(200)
  })

  it('updates a tpopkontr', async () => {
    const res = await pgrst(`/tpopkontr?id=eq.${existingKontr.id}`, {
      method: 'PATCH',
      token,
      body: { jahr: existingKontr.jahr },
    })
    expect(res.status).toBe(204)
  })

  it('creates a tpopkontr with a zaehl and removes it again', async () => {
    const inserted = await pgrst('/tpopkontr?select=id', {
      method: 'POST',
      token,
      prefer: 'return=representation',
      body: { tpop_id: tpopId, jahr: markerJahr, typ },
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
