import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { ApId } from '../../../../models/apflora/public/ApId.ts'
import type { PopId } from '../../../../models/apflora/public/PopId.ts'
import type { TpopId } from '../../../../models/apflora/public/TpopId.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface TPopPopberundmassnberQueryResult {
  allVTpopPopberundmassnbers: {
    nodes: {
      ap_id: ApId
      artname: string | null
      ap_bearbeitung: string | null
      ap_start_jahr: number | null
      ap_umsetzung: string | null
      pop_id: PopId
      pop_nr: number | null
      pop_name: string | null
      pop_status: string | null
      pop_bekannt_seit: number | null
      pop_status_unklar: boolean | null
      pop_status_unklar_begruendung: string | null
      pop_x: number | null
      pop_y: number | null
      tpop_id: TpopId
      tpop_nr: number | null
      tpop_gemeinde: string | null
      tpop_flurname: string | null
      tpop_status: string | null
      tpop_bekannt_seit: number | null
      tpop_status_unklar: boolean | null
      tpop_status_unklar_grund: string | null
      tpop_x: number | null
      tpop_y: number | null
      tpop_radius: number | null
      tpop_hoehe: number | null
      tpop_exposition: string | null
      tpop_klima: string | null
      tpop_neigung: string | null
      tpop_beschreibung: string | null
      tpop_kataster_nr: string | null
      tpop_apber_relevant: number | null
      tpop_eigentuemer: string | null
      tpop_kontakt: string | null
      tpop_nutzungszone: string | null
      tpop_bewirtschafter: string | null
      tpop_bewirtschaftung: string | null
      tpop_ekfrequenz: number | null
      tpop_ekfrequenz_abweichend: boolean | null
      tpopber_id: string | null
      tpopber_jahr: number | null
      tpopber_entwicklung: number | null
      tpopber_bemerkungen: string | null
      tpopber_created_at: string | null
      tpopber_updated_at: string | null
      tpopber_changed_by: string | null
      tpopmassnber_id: string | null
      tpopmassnber_jahr: number | null
      tpopmassnber_entwicklung: number | null
      tpopmassnber_bemerkungen: string | null
      tpopmassnber_created_at: string | null
      tpopmassnber_updated_at: string | null
      tpopmassnber_changed_by: string | null
    }[]
  }
}

export const TPopInklBerichte = () => {
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
        let result: { data: TPopPopberundmassnberQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query viewTpopPopberundmassnbers {
                allVTpopPopberundmassnbers {
                  nodes {
                    ap_id: apId
                    artname
                    ap_bearbeitung: apBearbeitung
                    ap_start_jahr: apStartJahr
                    ap_umsetzung: apUmsetzung
                    pop_id: popId
                    pop_nr: popNr
                    pop_name: popName
                    pop_status: popStatus
                    pop_bekannt_seit: popBekanntSeit
                    pop_status_unklar: popStatusUnklar
                    pop_status_unklar_begruendung: popStatusUnklarBegruendung
                    pop_x: popX
                    pop_y: popY
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
                    tpopber_id: tpopberId
                    tpopber_jahr: tpopberJahr
                    tpopber_entwicklung: tpopberEntwicklung
                    tpopber_bemerkungen: tpopberBemerkungen
                    tpopber_created_at: tpopberCreatedAt
                    tpopber_updated_at: tpopberUpdatedAt
                    tpopber_changed_by: tpopberChangedBy
                    tpopmassnber_id: tpopmassnberId
                    tpopmassnber_jahr: tpopmassnberJahr
                    tpopmassnber_entwicklung: tpopmassnberEntwicklung
                    tpopmassnber_bemerkungen: tpopmassnberBemerkungen
                    tpopmassnber_created_at: tpopmassnberCreatedAt
                    tpopmassnber_updated_at: tpopmassnberUpdatedAt
                    tpopmassnber_changed_by: tpopmassnberChangedBy
                  }
                }
              }
            `,
          })
        } catch (error) {
          addNotification({
            message: (error as Error).message,
            options: { variant: 'error' },
          })
        }
        setQueryState('verarbeite...')
        const rows = result.data?.allVTpopPopberundmassnbers?.nodes ?? []
        if (rows.length === 0) {
          setQueryState(undefined)
          return addNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({
          data: rows,
          fileName: 'TeilpopulationenTPopUndMassnBerichte',
        })
        setQueryState(undefined)
      }}
    >
      Teilpopulationen inklusive Teilpopulations- und Massnahmen-Berichten
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
