import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { ApId } from '../../../../models/apflora/public/ApId.ts'
import type { PopId } from '../../../../models/apflora/public/PopId.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface PopmassnberAnzMassnsQueryResult {
  allPopmassnbers: {
    nodes: {
      id: string
      vPopmassnberAnzmassnsById: {
        nodes: {
          apId: ApId
          artname: string | null
          apBearbeitung: string | null
          apStartJahr: number | null
          apUmsetzung: string | null
          popId: PopId
          popNr: number | null
          popName: string | null
          popStatus: string | null
          popBekanntSeit: number | null
          popStatusUnklar: boolean | null
          popStatusUnklarBegruendung: string | null
          popX: number | null
          popY: number | null
          popCreatedAt: string | null
          popUpdatedAt: string | null
          popChangedBy: string | null
          id: string
          jahr: number | null
          entwicklung: number | null
          bemerkungen: string | null
          createdAt: string | null
          updatedAt: string | null
          changedBy: string | null
          anzahlMassnahmen: number | null
        }[]
      }
    }[]
  }
}

export const AnzMassnBerichtsjahr = () => {
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
        let result: { data: PopmassnberAnzMassnsQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query popmassnberAnzMassnQuery {
                allPopmassnbers(
                  filter: { vPopmassnberAnzmassnsByIdExist: true }
                ) {
                  nodes {
                    id
                    vPopmassnberAnzmassnsById {
                      nodes {
                        apId
                        artname
                        apBearbeitung
                        apStartJahr
                        apUmsetzung
                        popId
                        popNr
                        popName
                        popStatus
                        popBekanntSeit
                        popStatusUnklar
                        popStatusUnklarBegruendung
                        popX
                        popY
                        popCreatedAt
                        popUpdatedAt
                        popChangedBy
                        id
                        jahr
                        entwicklung
                        bemerkungen
                        createdAt
                        updatedAt
                        changedBy
                        anzahlMassnahmen
                      }
                    }
                  }
                }
              }
            `,
          })
        } catch (error) {
          addNotification({
            message: (error as Error).message,
            options: {
              variant: 'error',
            },
          })
        }
        setQueryState('verarbeite...')
        const rows = (result?.data?.allPopmassnbers?.nodes ?? []).map((n) => ({
          ap_id: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apId ?? '',
          artname: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.artname ?? '',
          ap_bearbeitung:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apBearbeitung ?? '',
          ap_start_jahr:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apStartJahr ?? '',
          ap_umsetzung:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apUmsetzung ?? '',
          pop_id: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popId ?? '',
          pop_nr: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popNr ?? '',
          pop_name: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popName ?? '',
          pop_status: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popStatus ?? '',
          pop_bekannt_seit:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popBekanntSeit ?? '',
          pop_status_unklar:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popStatusUnklar ?? '',
          pop_status_unklar_begruendung:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]
              ?.popStatusUnklarBegruendung ?? '',
          pop_x: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popX ?? '',
          pop_y: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popY ?? '',
          pop_created_at:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popCreatedAt ?? '',
          pop_updated_at:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popUpdatedAt ?? '',
          pop_changed_by:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popChangedBy ?? '',
          id: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.id ?? '',
          jahr: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.jahr ?? '',
          entwicklung:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.entwicklung ?? '',
          bemerkungen:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.bemerkungen ?? '',
          created_at: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.createdAt ?? '',
          updated_at: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.updatedAt ?? '',
          changed_by: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.changedBy ?? '',
          anzahl_massnahmen:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.anzahlMassnahmen ?? '',
        }))
        if (rows.length === 0) {
          setQueryState(undefined)
          return addNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        console.log('Populationen export', { rows, data: result?.data })
        exportModule({
          data: sortBy(rows, ['artname', 'pop_nr', 'jahr']),
          fileName: 'PopulationenAnzMassnProMassnber',
        })
        setQueryState(undefined)
      }}
    >
      {`Populationen mit Massnahmen-Berichten: Anzahl Massnahmen im Berichtsjahr`}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
