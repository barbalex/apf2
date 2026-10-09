import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { graphql } from '../../../../gql/index.ts'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { PopId } from '../../../../models/apflora/index.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface PopKmlNamenQueryResult {
  allPops: {
    nodes: {
      id: PopId
      vPopKmlnamenById: {
        nodes: {
          art: string | null
          label: string | null
          inhalte: string | null
          id: PopId
          wgs84Lat: number | null
          wgs84Long: number | null
          url: string | null
        }[]
      }
    }[]
  }
}

export const PopsForGEArtname = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickPopsForGEArtname = async () => {
    setQueryState('lade Daten...')
    let result: { data?: PopKmlNamenQueryResult | undefined } | undefined
    try {
      result = await apolloClient.query<PopKmlNamenQueryResult>({
        query: graphql(`
              query popKmlNamenQuery {
                allPops(filter: { vPopKmlnamenByIdExist: true }) {
                  nodes {
                    id
                    vPopKmlnamenById {
                      nodes {
                        art
                        label
                        inhalte
                        id
                        wgs84Lat
                        wgs84Long
                        url
                      }
                    }
                  }
                }
              }
            `),
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
      art: z?.vPopKmlnamenById?.nodes?.[0]?.art ?? '',
      label: z?.vPopKmlnamenById?.nodes?.[0]?.label ?? '',
      inhalte: z?.vPopKmlnamenById?.nodes?.[0]?.inhalte ?? '',
      id: z?.vPopKmlnamenById?.nodes?.[0]?.id ?? '',
      wgs84Lat: z?.vPopKmlnamenById?.nodes?.[0]?.wgs84Lat ?? '',
      wgs84Long: z?.vPopKmlnamenById?.nodes?.[0]?.wgs84Long ?? '',
      url: z?.vPopKmlnamenById?.nodes?.[0]?.url ?? '',
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
    void exportModule({
      data: sortBy(rows, ['art', 'label']),
      fileName: 'PopulationenNachNamen',
      kml: true,
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickPopsForGEArtname()}
    >
      {`Populationen für Google Earth (beschriftet mit Artname, PopNr)`}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
