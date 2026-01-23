import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import {
  ApId,
  ZielId,
  AdresseId,
  ZielTypWerteCode,
} from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface ZielsQueryResult {
  allZiels: {
    nodes: Array<{
      id: ZielId
      jahr?: number
      typ?: ZielTypWerteCode
      zielTypWerteByTyp?: {
        id: number
        text?: string
      }
      bezeichnung?: string
      erreichung?: number
      bemerkungen?: string
      apByApId?: {
        id: ApId
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
        aeTaxonomyByArtId?: {
          id: string
          artname?: string
        }
      }
    }>
  }
}

export const Ziele = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickZiele = async () => {
    setQueryState('lade Daten...')
    let result: { data?: ZielsQueryResult }
    try {
      result = await apolloClient.query<ZielsQueryResult>({
        query: gql`
          query zielsForExportQuery {
            allZiels(
              orderBy: [
                AP_BY_AP_ID__ART_ID_ASC
                JAHR_ASC
                ZIEL_TYP_WERTE_BY_TYP__TEXT_ASC
                ZIEL_TYP_WERTE_BY_TYP__TEXT_ASC
              ]
            ) {
              nodes {
                id
                jahr
                typ
                zielTypWerteByTyp {
                  id
                  text
                }
                bezeichnung
                erreichung
                bemerkungen
                apByApId {
                  id
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
                  aeTaxonomyByArtId {
                    id
                    artname
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
    const rows = (result.data?.allZiels?.nodes ?? []).map((z) => ({
      ap_id: z.id,
      artname: z?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      jahr: z.jahr,
      typ: z?.zielTypWerteByTyp?.text ?? '',
      bezeichnung: z.bezeichnung,
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
    exportModule({ data: sortBy(rows, ['artname']), fileName: 'ApZiele' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickZiele}
      color="inherit"
      disabled={!!queryState}
    >
      Ziele
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
