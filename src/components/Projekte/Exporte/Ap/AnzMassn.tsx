import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'

import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import { ApId } from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface ApAnzmassnsQueryResult {
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
      vApAnzmassnsById?: {
        nodes: Array<{
          id: ApId
          anzahlMassnahmen?: number
        }>
      }
    }>
  }
}

export const AnzMassn = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickAnzMassnProAp = async () => {
    setQueryState('lade Daten...')
    let result: { data?: ApAnzmassnsQueryResult }
    try {
      result = await apolloClient.query<ApAnzmassnsQueryResult>({
        query: gql`
          query apAnzmassnsForExportQuery {
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
                vApAnzmassnsById {
                  nodes {
                    id
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
    const rows = (result.data?.allAps?.nodes ?? []).map((z) => ({
      id: z.id,
      artname: z?.aeTaxonomyByArtId?.artname ?? '',
      bearbeitung: z?.apBearbstandWerteByBearbeitung?.text ?? '',
      start_jahr: z.startJahr,
      umsetzung: z?.apUmsetzungWerteByUmsetzung?.text ?? '',
      anzahl_kontrollen:
        z?.vApAnzmassnsById?.nodes?.[0]?.anzahlMassnahmen ?? '',
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
    exportModule({ data: rows, fileName: 'ApAnzahlMassnahmen' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickAnzMassnProAp}
      color="inherit"
      disabled={!!queryState}
    >
      Anzahl Massnahmen pro Art
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
