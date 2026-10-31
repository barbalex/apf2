import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import Button from '@mui/material/Button'

import { apiFetch } from '../../../../modules/api.ts'
import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treeTpopGqlFilterAtom,
} from '../../../../store/index.ts'

interface TPopProps {
  filtered?: boolean
}

export const TPop = ({ filtered = false }: TPopProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const tpopGqlFilter = useAtomValue(treeTpopGqlFilterAtom)

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickTPop = async () => {
    setQueryState('lade Daten...')
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
          created_at: string | null
          updated_at: string | null
          changed_by: string | null
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
    let emailByAdresse = new Map<string, string>()
    let adressNamen = new Map<string, string>()
    try {
      const tpopSelect =
        'id,pop_id,nr,gemeinde,flurname,status,bekannt_seit,status_unklar,status_unklar_grund,lv95_x,lv95_y,radius,hoehe,exposition,klima,neigung,beschreibung,kataster_nr,apber_relevant,apber_relevant_grund,eigentuemer,kontakt,nutzungszone,bewirtschafter,bewirtschaftung,ekfrequenz,ekfrequenz_abweichend,ekf_kontrolleur,created_at,updated_at,changed_by'
      // filtered: the cascade filter runs through query_tpop first
      const tpopsR = await (filtered ?
        (async () => {
          const ids =
            (await apiFetch<{ id: string }[]>('/rpc/query_tpop?select=id', {
              method: 'POST',
              body: JSON.stringify({ p_filter: tpopGqlFilter.filtered }),
            })) ?? []
          return ids.length ?
              ((await apiFetch(
                `/q_tpop?id=in.(${ids.map((r) => r.id).join(',')})&select=${tpopSelect}`,
              )) ?? [])
            : []
        })()
      : apiFetch(`/q_tpop?select=${tpopSelect}`))
      const [popsR, apsR, statusWerteR, adressenR] = await Promise.all([
        apiFetch<NonNullable<typeof pops>>(
          `/q_pop?select=id,ap_id,nr,name,status,bekannt_seit,status_unklar,status_unklar_begruendung,lv95_x,lv95_y`,
        ),
        apiFetch<NonNullable<typeof aps>>(
          `/v_ap?select=id,label,start_jahr,bearbeiter,ae_taxonomy_by_art_id,ap_bearbstand_werte_by_bearbeitung,ap_umsetzung_werte_by_umsetzung,adresse_by_bearbeiter`,
        ),
        apiFetch<{ code: number; text: string | null }[]>(
          `/pop_status_werte?select=code,text`,
        ),
        apiFetch<{ id: string; name: string | null }[]>(
          `/v_adresse?select=id,name`,
        ),
      ])
      tpops = (tpopsR as NonNullable<typeof tpops>) ?? []
      pops = popsR ?? []
      aps = apsR ?? []
      statusWerte = new Map(
        (statusWerteR ?? []).map((w) => [w.code, w.text ?? '']),
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
    const popById = new Map((pops ?? []).map((p) => [p.id, p]))
    const apById = new Map((aps ?? []).map((a) => [a.id, a]))
    const rows = (tpops ?? [])
      .map((n) => {
        const pop = popById.get(n.pop_id ?? '')
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
          id: n.id,
          nr: n.nr,
          gemeinde: n.gemeinde,
          flurname: n.flurname,
          status: n.status,
          statusDecodiert:
            n.status === null ? null : (statusWerte.get(n.status) ?? null),
          bekanntSeit: n.bekannt_seit,
          statusUnklar: n.status_unklar,
          statusUnklarGrund: n.status_unklar_grund,
          x: n.lv95_x,
          y: n.lv95_y,
          radius: n.radius,
          hoehe: n.hoehe,
          exposition: n.exposition,
          klima: n.klima,
          neigung: n.neigung,
          beschreibung: n.beschreibung,
          katasterNr: n.kataster_nr,
          apberRelevant: n.apber_relevant,
          apberRelevantGrund: n.apber_relevant_grund,
          eigentuemer: n.eigentuemer,
          kontakt: n.kontakt,
          nutzungszone: n.nutzungszone,
          bewirtschafter: n.bewirtschafter,
          bewirtschaftung: n.bewirtschaftung,
          ekfrequenz: n.ekfrequenz,
          ekfrequenzAbweichend: n.ekfrequenz_abweichend,
          ekfKontrolleur: adressNamen.get(n.ekf_kontrolleur ?? '') ?? null,
          createdAt: n.created_at,
          updatedAt: n.updated_at,
          changedBy: n.changed_by,
        }
      })
      .map((row) => ({
        ...row,
        _artname:
          apById.get(row.apId ?? '')?.ae_taxonomy_by_art_id?.artname ?? '',
      }))
      // former orderBy [AP_NAME_ASC, POP_BY_POP_ID__NR_ASC, NR_ASC]
      .sort(
        (a, b) =>
          a._artname.localeCompare(b._artname) ||
          (a.popNr ?? 0) - (b.popNr ?? 0) ||
          (a.nr ?? 0) - (b.nr ?? 0),
      )
      .map(({ _artname, ...rest }) => rest)
    const enrichedData = rows.map((oWithout) => {
      const o: typeof oWithout & { angesiedeltNachBeginnAp?: boolean | null } =
        {
          ...oWithout,
        }
      let nachBeginnAp: boolean | null = null
      if (
        o.apStartJahr &&
        o.bekanntSeit &&
        [200, 201, 202].includes(o.status as number)
      ) {
        if (o.apStartJahr <= o.bekanntSeit) {
          nachBeginnAp = true
        } else {
          nachBeginnAp = false
        }
      }
      o.angesiedeltNachBeginnAp = nachBeginnAp
      return o
    })
    //console.timeEnd('processing')
    //console.time('exporting')
    if (rows.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    await exportModule({
      data: enrichedData,
      fileName: 'Teilpopulationen',
    })
    setQueryState(undefined)
    //console.timeEnd('exporting')
  }

  const tpopIsFiltered = tableIsFiltered({ table: 'tpop' })

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickTPop()}
      color="inherit"
      disabled={!!queryState || (filtered && !tpopIsFiltered)}
    >
      {filtered ? 'Teilpopulationen (gefiltert)' : 'Teilpopulationen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
