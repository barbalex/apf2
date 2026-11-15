import { beforeAll, afterAll, describe, expect, it } from 'vitest'

import {
  assertBackendAvailable,
  type Json,
  mintToken,
  pgrst,
  psql,
  psqlJson,
} from './helpers.ts'

// the export_* RPC family (sql/postgrest/createExportRpcs.sql) assembles the
// five big exports server-side. The column keys ARE the csv/xlsx headers the
// app exports (getDataArrayFromExportObjects takes the first row's keys), so
// the key set + order is part of the contract and pinned here. RLS must scope
// the RPCs exactly like the query_ family: ap_reader only sees assigned aps.

const EXPORTS = {
  export_ap: [
    'id',
    'artname',
    'bearbeitung',
    'startJahr',
    'umsetzung',
    'avName',
    'avEmail',
    'createdAt',
    'updatedAt',
    'changedBy',
  ],
  export_pop: [
    'apId',
    'apArtname',
    'apBearbeitung',
    'apStartJahr',
    'apUmsetzung',
    'avName',
    'avEmail',
    'id',
    'nr',
    'name',
    'status',
    'bekanntSeit',
    'statusUnklar',
    'statusUnklarBegruendung',
    'x',
    'y',
    'createdAt',
    'updatedAt',
    'changedBy',
  ],
  export_tpop: [
    'apId',
    'apFamilie',
    'apArtname',
    'apBearbeitung',
    'apStartJahr',
    'apUmsetzung',
    'avName',
    'avEmail',
    'popId',
    'popNr',
    'popName',
    'popStatus',
    'popBekanntSeit',
    'popStatusUnklar',
    'popStatusUnklarBegruendung',
    'popX',
    'popY',
    'id',
    'nr',
    'gemeinde',
    'flurname',
    'status',
    'statusDecodiert',
    'bekanntSeit',
    'statusUnklar',
    'statusUnklarGrund',
    'x',
    'y',
    'radius',
    'hoehe',
    'exposition',
    'klima',
    'neigung',
    'beschreibung',
    'katasterNr',
    'apberRelevant',
    'apberRelevantGrund',
    'eigentuemer',
    'kontakt',
    'nutzungszone',
    'bewirtschafter',
    'bewirtschaftung',
    'ekfrequenz',
    'ekfrequenzAbweichend',
    'ekfKontrolleur',
    'createdAt',
    'updatedAt',
    'changedBy',
    'angesiedeltNachBeginnAp',
  ],
  export_tpopmassn: [
    'apId',
    'apFamilie',
    'apArtname',
    'apBearbeitung',
    'apStartJahr',
    'apUmsetzung',
    'avName',
    'avEmail',
    'popId',
    'popNr',
    'popName',
    'popStatus',
    'popBekanntSeit',
    'popStatusUnklar',
    'popStatusUnklarBegruendung',
    'popX',
    'popY',
    'tpopId',
    'tpopNr',
    'tpopGemeinde',
    'tpopFlurname',
    'tpopStatus',
    'tpopBekanntSeit',
    'tpopStatusUnklar',
    'tpopStatusUnklarGrund',
    'tpopX',
    'tpopY',
    'tpopRadius',
    'tpopHoehe',
    'tpopExposition',
    'tpopKlima',
    'tpopNeigung',
    'tpopBeschreibung',
    'tpopKatasterNr',
    'tpopApberRelevant',
    'tpopApberRelevantGrund',
    'tpopEigentuemer',
    'tpopKontakt',
    'tpopNutzungszone',
    'tpopBewirtschafter',
    'tpopBewirtschaftung',
    'tpopEkfrequenz',
    'tpopEkfrequenzAbweichend',
    'tpopEkfKontrolleur',
    'id',
    'jahr',
    'datum',
    'typ',
    'beschreibung',
    'bearbeiter',
    'bemerkungen',
    'planVorhanden',
    'planBezeichnung',
    'flaeche',
    'form',
    'pflanzanordnung',
    'markierung',
    'anzTriebe',
    'anzPflanzen',
    'anzPflanzstellen',
    'zieleinheitEinheit',
    'zieleinheitAnzahl',
    'wirtspflanze',
    'herkunftPop',
    'sammeldatum',
    'vonAnzahlIndividuen',
    'createdAt',
    'updatedAt',
    'changedBy',
  ],
  export_tpopkontr: [
    'apId',
    'apFamilie',
    'apArtname',
    'apBearbeitung',
    'apStartJahr',
    'apUmsetzung',
    'avName',
    'avEmail',
    'popId',
    'popNr',
    'popName',
    'popStatus',
    'popBekanntSeit',
    'popStatusUnklar',
    'popStatusUnklarBegruendung',
    'popX',
    'popY',
    'tpopId',
    'tpopNr',
    'tpopGemeinde',
    'tpopFlurname',
    'tpopStatus',
    'statusDecodiert',
    'tpopBekanntSeit',
    'tpopStatusUnklar',
    'tpopStatusUnklarGrund',
    'tpopX',
    'tpopY',
    'tpopRadius',
    'tpopHoehe',
    'tpopExposition',
    'tpopKlima',
    'tpopNeigung',
    'tpopBeschreibung',
    'tpopKatasterNr',
    'tpopApberRelevant',
    'tpopApberRelevantGrund',
    'tpopEigentuemer',
    'tpopKontakt',
    'tpopNutzungszone',
    'tpopBewirtschafter',
    'tpopBewirtschaftung',
    'tpopEkfrequenz',
    'tpopEkfrequenzAbweichend',
    'tpopEkfKontrolleur',
    'id',
    'jahr',
    'datum',
    'typ',
    'bearbeiter',
    'ueberlebensrate',
    'vitalitaet',
    'entwicklung',
    'ursachen',
    'erfolgsbeurteilung',
    'umsetzungAendern',
    'kontrolleAendern',
    'bemerkungen',
    'lrDelarze',
    'lrUmgebungDelarze',
    'vegetationstyp',
    'konkurrenz',
    'moosschicht',
    'krautschicht',
    'strauchschicht',
    'baumschicht',
    'idealbiotopUebereinstimmung',
    'handlungsbedarf',
    'flaecheUeberprueft',
    'flaeche',
    'planVorhanden',
    'deckungVegetation',
    'deckungNackterBoden',
    'deckungApArt',
    'jungpflanzenVorhanden',
    'vegetationshoeheMaximum',
    'vegetationshoeheMittel',
    'gefaehrdung',
    'createdAt',
    'updatedAt',
    'changedBy',
    'apberNichtRelevant',
    'apberNichtRelevantGrund',
    'ekfBemerkungen',
    'zaehlungen',
  ],
} as const

describe('export rpcs', () => {
  beforeAll(async () => {
    await assertBackendAvailable()
  })

  describe('column contract (keys are the export headers)', () => {
    const managerToken = () => mintToken('apflora_manager', 'gabriel')

    for (const [fn, expectedKeys] of Object.entries(EXPORTS)) {
      it(`${fn}: key set and order`, async () => {
        const res = await pgrst(`/rpc/${fn}?limit=1`, {
          method: 'POST',
          token: managerToken(),
          body: { p_filter: {} },
        })
        expect(res.status).toBe(200)
        const rows = res.data as Json[]
        // dev db is seeded from production - these tables are never empty
        expect(rows.length).toBeGreaterThan(0)
        expect(Object.keys(rows[0])).toEqual([...expectedKeys])
      })
    }
  })

  describe('assembly happens server-side', () => {
    const managerToken = () => mintToken('apflora_manager', 'gabriel')

    it('export_tpopkontr decodes werte and aggregates zaehlungen', async () => {
      const res = await pgrst(
        `/rpc/export_tpopkontr?limit=2000&select=statusDecodiert,typ,entwicklung,zaehlungen`,
        { method: 'POST', token: managerToken(), body: { p_filter: {} } },
      )
      expect(res.status).toBe(200)
      const rows = res.data as Record<string, unknown>[]
      const statusTexte = new Set(
        psqlJson<{ text: string | null }>(
          `select text from apflora.pop_status_werte`,
        ).map((r) => r.text),
      )
      const withStatus = rows.filter((r) => r.statusDecodiert !== null)
      expect(withStatus.length).toBeGreaterThan(0)
      for (const row of withStatus) {
        expect(statusTexte.has(row.statusDecodiert as string)).toBe(true)
      }
      // typ holds the German text (tpopkontr.typ references the werte text)
      const typs = new Set(
        psqlJson<{ text: string | null }>(
          `select text from apflora.tpopkontr_typ_werte`,
        ).map((r) => r.text),
      )
      const withTyp = rows.filter((r) => r.typ !== null)
      expect(withTyp.length).toBeGreaterThan(0)
      for (const row of withTyp) {
        expect(typs.has(row.typ as string)).toBe(true)
      }
      const withZaehlungen = rows.filter(
        (r) => typeof r.zaehlungen === 'string' && r.zaehlungen !== '',
      )
      expect(withZaehlungen.length).toBeGreaterThan(0)
      expect(withZaehlungen[0].zaehlungen).toMatch(
        /^Einheit: .+, Methode: .+, Anzahl: .+( \/ Einheit: .+)?$/,
      )
    })

    it('export_tpopmassn decodes typ and zieleinheitEinheit', async () => {
      const res = await pgrst(
        `/rpc/export_tpopmassn?limit=2000&select=typ,zieleinheitEinheit`,
        { method: 'POST', token: managerToken(), body: { p_filter: {} } },
      )
      expect(res.status).toBe(200)
      const rows = res.data as Record<string, unknown>[]
      const typTexte = new Set(
        psqlJson<{ text: string | null }>(
          `select text from apflora.tpopmassn_typ_werte`,
        ).map((r) => r.text),
      )
      const withTyp = rows.filter((r) => r.typ !== null)
      expect(withTyp.length).toBeGreaterThan(0)
      for (const row of withTyp) {
        expect(typTexte.has(row.typ as string)).toBe(true)
      }
    })

    it('export_tpop computes angesiedeltNachBeginnAp like the app did', async () => {
      const res = await pgrst(
        `/rpc/export_tpop?select=id,angesiedeltNachBeginnAp&limit=500`,
        { method: 'POST', token: managerToken(), body: { p_filter: {} } },
      )
      expect(res.status).toBe(200)
      const rows = res.data as Record<string, unknown>[]
      // one batched SQL cross-check for all fetched ids
      const ids = rows.map((r) => `'${r.id}'`).join(',')
      const expectedById = new Map(
        psqlJson<{ id: string; val: boolean | null }>(
          `select t.id as id,
             (case when a.start_jahr is not null and a.start_jahr <> 0
                and t.bekannt_seit is not null and t.bekannt_seit <> 0
                and t.status in (200, 201, 202)
              then a.start_jahr <= t.bekannt_seit else null end) as val
           from apflora.tpop t
           left join apflora.pop p on p.id = t.pop_id
           left join apflora.ap a on a.id = p.ap_id
          where t.id in (${ids})`,
        ).map((r) => [r.id, r.val]),
      )
      const mismatches = rows.filter(
        (row) =>
          expectedById.get(row.id as string) !== row.angesiedeltNachBeginnAp,
      )
      expect(mismatches).toEqual([])
    })
  })

  describe('cascade filter compiles inside the rpc', () => {
    it('export_tpopkontr respects an apId filter', async () => {
      // the ap with the most kontrollen, for a non-degenerate check
      const apId = psqlJson<{ ap_id: string }>(
        `select p.ap_id
           from apflora.tpopkontr c
           join apflora.tpop t on t.id = c.tpop_id
           join apflora.pop p on p.id = t.pop_id
          group by p.ap_id order by count(*) desc limit 1`,
      )[0].ap_id
      const expected = psqlJson<{ count: number }>(
        `select count(*)::int as count
           from apflora.tpopkontr c
           join apflora.tpop t on t.id = c.tpop_id
           join apflora.pop p on p.id = t.pop_id
          where p.ap_id = '${apId}'`,
      )[0].count
      expect(expected).toBeGreaterThan(0)

      const res = await pgrst(`/rpc/export_tpopkontr?select=apId`, {
        method: 'POST',
        token: mintToken('apflora_manager', 'gabriel'),
        body: {
          p_filter: {
            tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } },
          },
        },
      })
      expect(res.status).toBe(200)
      const rows = res.data as Json[]
      expect(rows.length).toBe(expected)
      expect(new Set(rows.map((r) => r.apId))).toEqual(new Set([apId]))
    })
  })

  describe('RLS scopes the rpcs like the query_ family', () => {
    // like rls.test.ts: the dev db has no apflora_ap_reader - seed one
    const readerName = 'api-test-export-reader'
    const token = () => mintToken('apflora_ap_reader', readerName)
    let seededApIds: string[] = []

    beforeAll(() => {
      psql(
        `insert into apflora."user" (name, pass, role)
         values ('${readerName}', crypt('api-test', gen_salt('bf')),
                 'apflora_ap_reader')`,
      )
      // one ap with kontrollen (non-degenerate) and one without
      const withKontr = psqlJson<{ ap_id: string }>(
        `select p.ap_id
           from apflora.tpopkontr c
           join apflora.tpop t on t.id = c.tpop_id
           join apflora.pop p on p.id = t.pop_id
          group by p.ap_id order by count(*) desc limit 1`,
      )[0].ap_id
      const withoutKontr = psqlJson<{ id: string }>(
        `select a.id from apflora.ap a
          where not exists (
            select 1 from apflora.pop p
            join apflora.tpop t on t.pop_id = p.id
            join apflora.tpopkontr c on c.tpop_id = t.id
           where p.ap_id = a.id)
          limit 1`,
      )[0].id
      seededApIds = [withKontr, withoutKontr]
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

    it('export_ap returns exactly the assigned aps', async () => {
      const res = await pgrst(`/rpc/export_ap?select=id`, {
        method: 'POST',
        token: token(),
        body: { p_filter: {} },
      })
      expect(res.status).toBe(200)
      const seen = (res.data as Json[]).map((r) => r.id).sort()
      expect(seen).toEqual([...seededApIds].sort())
    })

    it('export_tpopkontr returns only kontrollen of assigned aps', async () => {
      const res = await pgrst(`/rpc/export_tpopkontr?select=apId`, {
        method: 'POST',
        token: token(),
        body: { p_filter: {} },
      })
      expect(res.status).toBe(200)
      const rows = res.data as Json[]
      expect(rows.length).toBeGreaterThan(0)
      const apIds = new Set(rows.map((r) => r.apId))
      expect(apIds).toEqual(new Set([seededApIds[0]]))
    })
  })
})
