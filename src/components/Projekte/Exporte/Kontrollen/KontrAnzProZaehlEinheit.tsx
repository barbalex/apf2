import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import {
  ApId,
  PopId,
  TpopId,
  TpopkontrId,
} from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface KontrzaehlAnzproeinheitQueryResult {
  allVKontrzaehlAnzproeinheits: {
    nodes: Array<{
      ap_id?: ApId
      artname?: string
      ap_bearbeitung?: string
      ap_start_jahr?: number
      ap_umsetzung?: string
      ap_bearbeiter?: string
      pop_id?: PopId
      pop_nr?: number
      pop_name?: string
      pop_status?: string
      pop_bekannt_seit?: number
      tpop_id?: TpopId
      tpop_nr?: number
      tpop_gemeinde?: string
      tpop_flurname?: string
      tpop_status?: number
      tpop_bekannt_seit?: number
      tpop_status_unklar?: boolean
      tpop_status_unklar_grund?: string
      tpop_x?: number
      tpop_y?: number
      tpop_radius?: number
      tpop_hoehe?: number
      tpop_exposition?: string
      tpop_klima?: string
      tpop_neigung?: string
      tpop_beschreibung?: string
      tpop_kataster_nr?: string
      tpop_apber_relevant?: number
      tpop_eigentuemer?: string
      tpop_kontakt?: string
      tpop_nutzungszone?: string
      tpop_bewirtschafter?: string
      tpop_bewirtschaftung?: string
      tpop_ekfrequenz?: string
      tpop_ekfrequenz_abweichend?: boolean
      kontr_id?: TpopkontrId
      kontr_jahr?: number
      kontr_datum?: string
      kontr_typ?: string
      kontr_bearbeiter?: string
      kontr_ueberlebensrate?: number
      kontr_vitalitaet?: string
      kontr_entwicklung?: string
      kontr_ursachen?: string
      kontr_erfolgsbeurteilung?: string
      kontr_umsetzung_aendern?: string
      kontr_kontrolle_aendern?: string
      kontr_bemerkungen?: string
      kontr_lr_delarze?: string
      kontr_lr_umgebung_delarze?: string
      kontr_vegetationstyp?: string
      kontr_konkurrenz?: string
      kontr_moosschicht?: string
      kontr_krautschicht?: string
      kontr_strauchschicht?: string
      kontr_baumschicht?: string
      kontr_idealbiotop_uebereinstimmung?: string
      kontr_handlungsbedarf?: string
      kontr_flaeche_ueberprueft?: number
      kontr_flaeche?: number
      kontr_plan_vorhanden?: boolean
      kontr_deckung_vegetation?: number
      kontr_deckung_nackter_boden?: number
      kontr_deckung_ap_art?: number
      kontr_jungpflanzen_vorhanden?: boolean
      kontr_vegetationshoehe_maximum?: number
      kontr_vegetationshoehe_mittel?: number
      kontr_gefaehrdung?: string
      kontr_created_at?: string
      kontr_updated_at?: string
      kontr_changed_by?: string
      kontr_apber_nicht_relevant?: boolean
      apber_nicht_relevant_grund?: string
      ekf_bemerkungen?: string
      id?: string
      einheit?: string
      methode?: string
      anzahl?: number
    }>
  }
}

export const KontrAnzProZaehlEinheit = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result: { data?: KontrzaehlAnzproeinheitQueryResult }
        try {
          result = await apolloClient.query<KontrzaehlAnzproeinheitQueryResult>(
            {
              query: gql`
                query viewKontrzaehlAnzproeinheits {
                  allVKontrzaehlAnzproeinheits {
                    nodes {
                      ap_id: apId
                      artname
                      ap_bearbeitung: apBearbeitung
                      ap_start_jahr: apStartJahr
                      ap_umsetzung: apUmsetzung
                      ap_bearbeiter: apBearbeiter
                      pop_id: popId
                      pop_nr: popNr
                      pop_name: popName
                      pop_status: popStatus
                      pop_bekannt_seit: popBekanntSeit
                      tpop_id: tpopId
                      tpop_nr: tpopNr
                      tpop_gemeinde: tpopGemeinde
                      tpop_flurname: tpopFlurname
                      tpop_status: tpopStatus
                      tpop_bekannt_seit: tpopBekanntSeit
                      tpop_status_unklar: tpopStatusUnklar
                      tpop_status_unklar_grund: tpopStatusUnklarGrund
                      tpop_x: tpopX
                      tpop_y: tpopY
                      tpop_radius: tpopRadius
                      tpop_hoehe: tpopHoehe
                      tpop_exposition: tpopExposition
                      tpop_klima: tpopKlima
                      tpop_neigung: tpopNeigung
                      tpop_beschreibung: tpopBeschreibung
                      tpop_kataster_nr: tpopKatasterNr
                      tpop_apber_relevant: tpopApberRelevant
                      tpop_eigentuemer: tpopEigentuemer
                      tpop_kontakt: tpopKontakt
                      tpop_nutzungszone: tpopNutzungszone
                      tpop_bewirtschafter: tpopBewirtschafter
                      tpop_bewirtschaftung: tpopBewirtschaftung
                      tpop_ekfrequenz: tpopEkfrequenz
                      tpop_ekfrequenz_abweichend: tpopEkfrequenzAbweichend
                      kontr_id: kontrId
                      kontr_jahr: kontrJahr
                      kontr_datum: kontrDatum
                      kontr_typ: kontrTyp
                      kontr_bearbeiter: kontrBearbeiter
                      kontr_ueberlebensrate: kontrUeberlebensrate
                      kontr_vitalitaet: kontrVitalitaet
                      kontr_entwicklung: kontrEntwicklung
                      kontr_ursachen: kontrUrsachen
                      kontr_erfolgsbeurteilung: kontrErfolgsbeurteilung
                      kontr_umsetzung_aendern: kontrUmsetzungAendern
                      kontr_kontrolle_aendern: kontrKontrolleAendern
                      kontr_bemerkungen: kontrBemerkungen
                      kontr_lr_delarze: kontrLrDelarze
                      kontr_lr_umgebung_delarze: kontrLrUmgebungDelarze
                      kontr_vegetationstyp: kontrVegetationstyp
                      kontr_konkurrenz: kontrKonkurrenz
                      kontr_moosschicht: kontrMoosschicht
                      kontr_krautschicht: kontrKrautschicht
                      kontr_strauchschicht: kontrStrauchschicht
                      kontr_baumschicht: kontrBaumschicht
                      kontr_idealbiotop_uebereinstimmung: kontrIdealbiotopUebereinstimmung
                      kontr_handlungsbedarf: kontrHandlungsbedarf
                      kontr_flaeche_ueberprueft: kontrFlaecheUeberprueft
                      kontr_flaeche: kontrFlaeche
                      kontr_plan_vorhanden: kontrPlanVorhanden
                      kontr_deckung_vegetation: kontrDeckungVegetation
                      kontr_deckung_nackter_boden: kontrDeckungNackterBoden
                      kontr_deckung_ap_art: kontrDeckungApArt
                      kontr_jungpflanzen_vorhanden: kontrJungpflanzenVorhanden
                      kontr_vegetationshoehe_maximum: kontrVegetationshoeheMaximum
                      kontr_vegetationshoehe_mittel: kontrVegetationshoeheMittel
                      kontr_gefaehrdung: kontrGefaehrdung
                      kontr_created_at: kontrCreatedAt
                      kontr_updated_at: kontrUpdatedAt
                      kontr_changed_by: kontrChangedBy
                      kontr_apber_nicht_relevant: kontrApberNichtRelevant
                      apber_nicht_relevant_grund: kontrApberNichtRelevantGrund
                      ekf_bemerkungen: kontrEkfBemerkungen
                      id
                      einheit
                      methode
                      anzahl
                    }
                  }
                }
              `,
            },
          )
        } catch (error) {
          addNotification({
            message: (error as Error).message,
            options: {
              variant: 'error',
            },
          })
        }
        setQueryState('verarbeite...')
        const rows = result.data?.allVKontrzaehlAnzproeinheits?.nodes ?? []
        setQueryState(undefined)
        if (rows.length === 0) {
          return addNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({
          data: rows,
          fileName: 'KontrollenAnzahlProZaehleinheit',
        })
      }}
    >
      Kontrollen: Anzahl pro Zähleinheit
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
