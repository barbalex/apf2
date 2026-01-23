import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import {
  ApId,
  AssozartId,
  AdresseId,
} from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface AssozartsQueryResult {
  allAssozarts: {
    nodes: Array<{
      id: AssozartId
      apId?: ApId
      aeTaxonomyByAeId?: {
        id: string
        artname?: string
      }
      apByApId?: {
        id: ApId
        label?: string
        apBearbstandWerteByBearbeitung?: {
          id: number
          text?: string
        }
        startJahr?: number
        apUmsetzungWerteByUmsetzung?: {
          id: number
          text?: string
        }
        adresseByBearbeiter?: {
          id: AdresseId
          name?: string
        }
      }
      bemerkungen?: string
      createdAt?: string
      updatedAt?: string
      changedBy?: string
    }>
  }
}

export const Assozart = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickAssozarten = async () => {
    setQueryState('lade Daten...')
    let result: { data?: AssozartsQueryResult }
    try {
      result = await apolloClient.query<AssozartsQueryResult>({
        query: gql`
          query assozartsForExportQuery {
            allAssozarts(
              orderBy: [
                AP_BY_AP_ID__LABEL_ASC
                AE_TAXONOMY_BY_AE_ID__ARTNAME_ASC
              ]
            ) {
              nodes {
                id
                apId
                aeTaxonomyByAeId {
                  id
                  artname
                }
                apByApId {
                  id
                  label
                  apBearbstandWerteByBearbeitung {
                    id
                    text
                  }
                  startJahr
                  apUmsetzungWerteByUmsetzung {
                    id
                    text
                  }
                  adresseByBearbeiter {
                    id
                    name
                  }
                }
                bemerkungen
                createdAt
                updatedAt
                changedBy
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
    const rows = (result.data?.allAssozarts?.nodes ?? []).map((z) => ({
      ap_id: z.apId,
      artname: z?.apByApId?.label ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      artname_assoziiert: z?.aeTaxonomyByAeId?.artname ?? '',
      bemerkungen: z.bemerkungen,
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changedBy,
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
    exportModule({ data: rows, fileName: 'AssoziierteArten' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickAssozarten}
      color="inherit"
      disabled={!!queryState}
    >
      Assoziierte Arten
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
