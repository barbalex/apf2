import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import { ApId } from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface ApOhnepopQueryResult {
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
      popsByApId?: {
        totalCount: number
      }
    }>
  }
}

export const ApOhnePop = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickApOhnePop = async () => {
    setQueryState('lade Daten...')
    let result: { data?: ApOhnepopQueryResult }
    try {
      result = await apolloClient.query<ApOhnepopQueryResult>({
        query: gql`
          query apOhnepopForExportQuery {
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
                popsByApId {
                  totalCount
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
    const rows = (result.data?.allAps?.nodes ?? [])
      .filter((z) => z?.popsByApId?.totalCount === 0)
      .map((z) => ({
        id: z.id,
        artname: z?.aeTaxonomyByArtId.artname ?? '',
        bearbeitung: z?.apBearbstandWerteByBearbeitung?.text ?? '',
        start_jahr: z.startJahr,
        umsetzung: z?.apUmsetzungWerteByUmsetzung?.text ?? '',
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
    exportModule({ data: rows, fileName: 'ApOhnePopulationen' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickApOhnePop}
      color="inherit"
      disabled={!!queryState}
    >
      Arten ohne Populationen
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
