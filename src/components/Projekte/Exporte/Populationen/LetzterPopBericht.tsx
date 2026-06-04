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

import { addNotificationAtom } from '../../../../store/index.ts'

interface PopMitLetzterPopberQueryResult {
  allPops: {
    nodes: {
      id: PopId
      vPopMitLetzterPopbersByPopId: {
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
          tpopsApberRelevant: number | null
          tpopsApberRelevantGrund: string | null
          popRelevantFuerProjektdokuKarten: boolean | null
          popCreatedAt: string | null
          popUpdatedAt: string | null
          popChangedBy: string | null
          popberId: string | null
          popberJahr: number | null
          popberEntwicklung: number | null
          popberBemerkungen: string | null
          popberCreatedAt: string | null
          popberUpdatedAt: string | null
          popberChangedBy: string | null
        }[]
      }
    }[]
  }
}

export const LetzterPopBericht = () => {
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
        let result: { data: PopMitLetzterPopberQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query popMitLetzterPopbersQuery {
                allPops(filter: { vPopMitLetzterPopbersByPopIdExist: true }) {
                  nodes {
                    id
                    # view: v_pop_mit_letzter_popber
                    vPopMitLetzterPopbersByPopId {
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
                        tpopsApberRelevant
                        tpopsApberRelevantGrund
                        popRelevantFuerProjektdokuKarten
                        popCreatedAt
                        popUpdatedAt
                        popChangedBy
                        popberId
                        popberJahr
                        popberEntwicklung
                        popberBemerkungen
                        popberCreatedAt
                        popberUpdatedAt
                        popberChangedBy
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
        const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
          ap_id: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apId ?? '',
          artname: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.artname ?? '',
          ap_bearbeitung:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apBearbeitung ?? '',
          ap_start_jahr:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apStartJahr ?? '',
          ap_umsetzung:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.apUmsetzung ?? '',
          pop_id: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popId ?? '',
          pop_nr: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popNr ?? '',
          pop_name: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popName ?? '',
          pop_status:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popStatus ?? '',
          pop_bekannt_seit:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popBekanntSeit ?? '',
          pop_status_unklar:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popStatusUnklar ?? '',
          pop_status_unklar_begruendung:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]
              ?.popStatusUnklarBegruendung ?? '',
          pop_x: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popX ?? '',
          pop_y: z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popY ?? '',
          tpops_apber_relevant:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.tpopsApberRelevant ??
            '',
          tpops_apber_relevant_grund:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]
              ?.tpopsApberRelevantGrund ?? '',
          pop_relevant_fuer_projektdoku_karten:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]
              ?.popRelevantFuerProjektdokuKarten ?? '',
          pop_created_at:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popCreatedAt ?? '',
          pop_updated_at:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popUpdatedAt ?? '',
          pop_changed_by:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popChangedBy ?? '',
          popber_id:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberId ?? '',
          popber_jahr:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberJahr ?? '',
          popber_entwicklung:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberEntwicklung ??
            '',
          popber_bemerkungen:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberBemerkungen ??
            '',
          popber_created_at:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberCreatedAt ?? '',
          popber_updated_at:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberUpdatedAt ?? '',
          popber_changed_by:
            z?.vPopMitLetzterPopbersByPopId?.nodes?.[0]?.popberChangedBy ?? '',
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
        exportModule({
          data: sortBy(rows, ['artname', 'pop_nr']),
          fileName: 'PopulationenMitLetzemPopBericht',
        })
        setQueryState(undefined)
      }}
    >
      Populationen mit dem letzten Populations-Bericht
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
