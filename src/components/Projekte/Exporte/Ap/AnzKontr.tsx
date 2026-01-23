import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import { ApId } from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface ApAnzkontrsQueryResult {
  allAps: {
    nodes: Array<{
      id: ApId
      aeTaxonomyByArtId?: {
        id: string
        artname?: string
      }
      apBearbstandWerteByBearbeitung?: {
        id: number
        text?: string
      }
      startJahr?: number
      apUmsetzungWerteByUmsetzung?: {
        id: number
        text?: string
      }
      vApAnzkontrsById?: {
        nodes: Array<{
          id: ApId
          anzahlKontrollen?: number
        }>
      }
    }>
  }
}

export const AnzKontr = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickAnzKontrProAp = async () => {
    setQueryState('lade Daten...')
    let result: { data?: ApAnzkontrsQueryResult }
    try {
      result = await apolloClient.query<ApAnzkontrsQueryResult>({
        query: gql`
          query apAnzkontrsForExportQuery {
            allAps(orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC) {
              nodes {
                id
                aeTaxonomyByArtId {
                  id
                  artname
                }
                apBearbstandWerteByBearbeitung {
                  id
                  text
                }
                startJahr
                apUmsetzungWerteByUmsetzung {
                  id
                  text
                }
                vApAnzkontrsById {
                  nodes {
                    id
                    anzahlKontrollen
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
    const rows = (result.data?.allAps.nodes ?? []).map((z) => ({
      id: z.id,
      artname: z?.aeTaxonomyByArtId?.artname ?? '',
      bearbeitung: z?.apBearbstandWerteByBearbeitung?.text ?? '',
      start_jahr: z.startJahr,
      umsetzung: z?.apUmsetzungWerteByUmsetzung?.text ?? '',
      anzahl_kontrollen:
        z?.vApAnzkontrsById?.nodes?.[0]?.anzahlKontrollen ?? '',
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
    exportModule({ data: rows, fileName: 'ApAnzahlKontrollen' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickAnzKontrProAp}
      color="inherit"
      disabled={!!queryState}
    >
      Anzahl Kontrollen pro Art
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
