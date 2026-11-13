import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeTpopmassnGqlFilterAtom,
} from '../../../../store/index.ts'
import { store } from '../../../../store/index.ts'

interface MassnahmenProps {
  filtered?: boolean
}

export const Massnahmen = ({ filtered = false }: MassnahmenProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tpopmassnGqlFilter = useAtomValue(treeTpopmassnGqlFilterAtom)

  const [queryState, setQueryState] = useState<string | undefined>()

  const tpopmassnIsFiltered = tableIsFiltered({ store, table: 'tpopmassn' })

  const onClickMassnahmen = async () => {
    setQueryState('lade Daten...')
    let massns:
      | {
          id: string
          tpop_id: string | null
          jahr: number | null
          datum: string | null
          typ: number | null
          beschreibung: string | null
          bearbeiter: string | null
          bemerkungen: string | null
          plan_vorhanden: boolean | null
          plan_bezeichnung: string | null
          flaeche: number | null
          form: string | null
          pflanzanordnung: string | null
          markierung: string | null
          anz_triebe: number | null
          anz_pflanzen: number | null
          anz_pflanzstellen: number | null
          zieleinheit_einheit: number | null
          zieleinheit_anzahl: number | null
          wirtspflanze: string | null
          herkunft_pop: string | null
          sammeldatum: string | null
          von_anzahl_individuen: number | null
          created_at: string | null
          updated_at: string | null
          changed_by: string | null
        }[]
      | undefined
    let tpops:
      | {
          id: string
          pop_id: string | null
          nr: number | null
          gemeinde: string | null
          flurname: string | null
          status: number | null
          bekannt_seit: number | null
          status_unklar: boolean | null
          status_unklar_grund: string | null
          lv95_x: number | null
          lv95_y: number | null
          radius: number | null
          hoehe: number | null
          exposition: string | null
          klima: string | null
          neigung: string | null
          beschreibung: string | null
          kataster_nr: string | null
          apber_relevant: number | null
          apber_relevant_grund: number | null
          eigentuemer: string | null
          kontakt: string | null
          nutzungszone: string | null
          bewirtschafter: string | null
          bewirtschaftung: string | null
          ekfrequenz: string | null
          ekfrequenz_abweichend: boolean | null
          ekf_kontrolleur: string | null
        }[]
      | undefined
    let pops:
      | {
          id: string
          ap_id: string | null
          nr: number | null
          name: string | null
          status: number | null
          bekannt_seit: number | null
          status_unklar: boolean | null
          status_unklar_begruendung: string | null
          lv95_x: number | null
          lv95_y: number | null
        }[]
      | undefined
    let aps:
      | {
          id: string
          label: string | null
          start_jahr: number | null
          bearbeiter: string | null
          ae_taxonomy_by_art_id: {
            artname: string | null
            familie: string | null
          } | null
          ap_bearbstand_werte_by_bearbeitung: { text: string | null } | null
          ap_umsetzung_werte_by_umsetzung: { text: string | null } | null
          adresse_by_bearbeiter: { name: string | null } | null
        }[]
      | undefined
    let statusWerte = new Map<number, string>()
    let massnTypWerte = new Map<number, string>()
    let einheitWerte = new Map<number, string>()
    let emailByAdresse = new Map<string, string>()
    let adressNamen = new Map<string, string>()
    try {
      const massnSelect =
        'id,tpop_id,jahr,datum,typ,beschreibung,bearbeiter,bemerkungen,plan_vorhanden,plan_bezeichnung,flaeche,form,pflanzanordnung,markierung,anz_triebe,anz_pflanzen,anz_pflanzstellen,zieleinheit_einheit,zieleinheit_anzahl,wirtspflanze,herkunft_pop,sammeldatum,von_anzahl_individuen,created_at,updated_at,changed_by'
      // filtered: the cascade filter runs through query_tpopmassn first
      const massnsR = await (filtered ?
        (async () => {
          const ids =
            (await apiFetch<{ id: string }[]>(
              '/rpc/query_tpopmassn?select=id',
              {
                method: 'POST',
                body: JSON.stringify({
                  p_filter: tpopmassnGqlFilter.filtered,
                }),
              },
            )) ?? []
          return ids.length ?
              ((await apiFetch(
                `/q_tpopmassn?id=in.(${ids.map((r) => r.id).join(',')})&select=${massnSelect}`,
              )) ?? [])
            : []
        })()
      : apiFetch(`/q_tpopmassn?select=${massnSelect}`))
      const [
        tpopsR,
        popsR,
        apsR,
        statusWerteR,
        massnTypWerteR,
        einheitWerteR,
        adressenR,
      ] = await Promise.all([
        apiFetch<NonNullable<typeof tpops>>(
          `/q_tpop?select=id,pop_id,nr,gemeinde,flurname,status,bekannt_seit,status_unklar,status_unklar_grund,lv95_x,lv95_y,radius,hoehe,exposition,klima,neigung,beschreibung,kataster_nr,apber_relevant,apber_relevant_grund,eigentuemer,kontakt,nutzungszone,bewirtschafter,bewirtschaftung,ekfrequenz,ekfrequenz_abweichend,ekf_kontrolleur`,
        ),
        apiFetch<NonNullable<typeof pops>>(
          `/q_pop?select=id,ap_id,nr,name,status,bekannt_seit,status_unklar,status_unklar_begruendung,lv95_x,lv95_y`,
        ),
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,label,start_jahr,bearbeiter,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/pop_status_werte?select=code,text`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/tpopmassn_typ_werte?select=code,text`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/v_tpopkontrzaehl_einheit_werte?select=code,text`,
        ),
        apiFetch<{ id: string; name: string | null }[]>(
          `/v_adresse?select=id,name`,
        ),
      ])
      massns = (massnsR as NonNullable<typeof massns>) ?? []
      tpops = tpopsR ?? []
      pops = popsR ?? []
      aps = apsR ?? []
      statusWerte = new Map(
        (statusWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      massnTypWerte = new Map(
        (massnTypWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      einheitWerte = new Map(
        (einheitWerteR ?? []).map((w) => [w.code, w.text ?? '']),
      )
      adressNamen = new Map((adressenR ?? []).map((a) => [a.id, a.name ?? '']))
      const bearbeiterIds = [
        ...new Set((aps ?? []).map((a) => a.bearbeiter).filter(Boolean)),
      ] as string[]
      if (bearbeiterIds.length) {
        const users =
          (await apiFetch<
            { adresse_id: string | null; email: string | null }[]
          >(
            `/user?adresse_id=in.(${bearbeiterIds.join(',')})&select=adresse_id,email`,
          )) ?? []
        emailByAdresse = new Map(
          users.map((u) => [u.adresse_id ?? '', u.email ?? '']),
        )
      }
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: { variant: 'error' },
      })
    }
    setQueryState('verarbeite...')
    const tpopById = new Map((tpops ?? []).map((t) => [t.id, t]))
    const popById = new Map((pops ?? []).map((p) => [p.id, p]))
    const apById = new Map((aps ?? []).map((a) => [a.id, a]))
    const rows = (massns ?? [])
      .map((n) => {
        const tpop = tpopById.get(n.tpop_id ?? '')
        const pop = tpop ? popById.get(tpop.pop_id ?? '') : undefined
        const apBy = pop?.ap_id ? apById.get(pop.ap_id) : undefined
        return {
          apId: apBy?.id ?? null,
          apFamilie: apBy?.ae_taxonomy_by_art_id?.familie ?? null,
          apArtname: apBy?.ae_taxonomy_by_art_id?.artname ?? null,
          apBearbeitung: apBy?.ap_bearbstand_werte_by_bearbeitung?.text ?? null,
          apStartJahr: apBy?.start_jahr ?? null,
          apUmsetzung: apBy?.ap_umsetzung_werte_by_umsetzung?.text ?? null,
          avName: apBy?.adresse_by_bearbeiter?.name ?? null,
          avEmail: emailByAdresse.get(apBy?.bearbeiter ?? '') ?? null,
          popId: pop?.id ?? null,
          popNr: pop?.nr ?? null,
          popName: pop?.name ?? null,
          popStatus:
            pop?.status == null ? null : (statusWerte.get(pop.status) ?? null),
          popBekanntSeit: pop?.bekannt_seit ?? null,
          popStatusUnklar: pop?.status_unklar ?? null,
          popStatusUnklarBegruendung: pop?.status_unklar_begruendung ?? null,
          popX: pop?.lv95_x ?? null,
          popY: pop?.lv95_y ?? null,
          tpopId: tpop?.id ?? null,
          tpopNr: tpop?.nr ?? null,
          tpopGemeinde: tpop?.gemeinde ?? null,
          tpopFlurname: tpop?.flurname ?? null,
          tpopStatus:
            tpop?.status == null ?
              null
            : (statusWerte.get(tpop.status) ?? null),
          tpopBekanntSeit: tpop?.bekannt_seit ?? null,
          tpopStatusUnklar: tpop?.status_unklar ?? null,
          tpopStatusUnklarGrund: tpop?.status_unklar_grund ?? null,
          tpopX: tpop?.lv95_x ?? null,
          tpopY: tpop?.lv95_y ?? null,
          tpopRadius: tpop?.radius ?? null,
          tpopHoehe: tpop?.hoehe ?? null,
          tpopExposition: tpop?.exposition ?? null,
          tpopKlima: tpop?.klima ?? null,
          tpopNeigung: tpop?.neigung ?? null,
          tpopBeschreibung: tpop?.beschreibung ?? null,
          tpopKatasterNr: tpop?.kataster_nr ?? null,
          tpopApberRelevant: tpop?.apber_relevant ?? null,
          tpopApberRelevantGrund: tpop?.apber_relevant_grund ?? null,
          tpopEigentuemer: tpop?.eigentuemer ?? null,
          tpopKontakt: tpop?.kontakt ?? null,
          tpopNutzungszone: tpop?.nutzungszone ?? null,
          tpopBewirtschafter: tpop?.bewirtschafter ?? null,
          tpopBewirtschaftung: tpop?.bewirtschaftung ?? null,
          tpopEkfrequenz: tpop?.ekfrequenz ?? null,
          tpopEkfrequenzAbweichend: tpop?.ekfrequenz_abweichend ?? null,
          tpopEkfKontrolleur:
            adressNamen.get(tpop?.ekf_kontrolleur ?? '') ?? null,
          id: n.id,
          jahr: n.jahr,
          datum: n.datum,
          typ: n.typ === null ? null : (massnTypWerte.get(n.typ) ?? null),
          beschreibung: n.beschreibung,
          bearbeiter: adressNamen.get(n.bearbeiter ?? '') ?? null,
          bemerkungen: n.bemerkungen,
          planVorhanden: n.plan_vorhanden,
          planBezeichnung: n.plan_bezeichnung,
          flaeche: n.flaeche,
          form: n.form,
          pflanzanordnung: n.pflanzanordnung,
          markierung: n.markierung,
          anzTriebe: n.anz_triebe,
          anzPflanzen: n.anz_pflanzen,
          anzPflanzstellen: n.anz_pflanzstellen,
          zieleinheitEinheit:
            n.zieleinheit_einheit === null ?
              null
            : (einheitWerte.get(n.zieleinheit_einheit) ?? null),
          zieleinheitAnzahl: n.zieleinheit_anzahl,
          wirtspflanze: n.wirtspflanze,
          herkunftPop: n.herkunft_pop,
          sammeldatum: n.sammeldatum,
          vonAnzahlIndividuen: n.von_anzahl_individuen,
          createdAt: n.created_at,
          updatedAt: n.updated_at,
          changedBy: n.changed_by,
          _artname: apBy?.ae_taxonomy_by_art_id?.artname ?? '',
        }
      })
      // former orderBy [AP_NAME_ASC, POP_NR_ASC, TPOP_BY_TPOP_ID__NR_ASC, DATUM_ASC]
      .sort(
        (a, b) =>
          a._artname.localeCompare(b._artname) ||
          (a.popNr ?? 0) - (b.popNr ?? 0) ||
          (a.tpopNr ?? 0) - (b.tpopNr ?? 0) ||
          (a.datum ?? '').localeCompare(b.datum ?? ''),
      )
      .map(({ _artname, ...rest }) => rest)
    if (rows.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    void exportModule({
      data: rows,
      fileName: 'Massnahmen',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState || (filtered && !tpopmassnIsFiltered)}
      onClick={() => void onClickMassnahmen()}
    >
      {filtered ? 'Massnahmen (gefiltert)' : 'Massnahmen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
