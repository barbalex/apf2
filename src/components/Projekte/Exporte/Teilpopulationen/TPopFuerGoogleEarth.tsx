import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { TpopId } from '../../../../models/apflora/public/TpopId.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface TPopKmlQueryResult {
  allTpops: {
    nodes: {
      id: TpopId
      vTpopKmlsById: {
        nodes: {
          art: string | null
          label: string | null
          inhalte: string | null
          id: TpopId
          wgs84Lat: number | null
          wgs84Long: number | null
          url: string | null
        }[]
      }
    }[]
  }
}

export const TPopFuerGoogleEarth = () => {
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
        let result: { data: TPopKmlQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query tpopKmlQuery {
                allTpops(filter: { vTpopKmlsByIdExist: true }) {
                  nodes {
                    id
                    vTpopKmlsById {
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
            `,
          })
        } catch (error) {
          addNotification({
            message: (error as Error).message,
            options: { variant: 'error' },
          })
        }
        setQueryState('verarbeite...')
        const rows = (result.data?.allTpops?.nodes ?? []).map((z) => ({
          art: z?.vTpopKmlsById?.nodes?.[0]?.art ?? '',
          label: z?.vTpopKmlsById?.nodes?.[0]?.label ?? '',
          inhalte: z?.vTpopKmlsById?.nodes?.[0]?.inhalte ?? '',
          id: z?.vTpopKmlsById?.nodes?.[0]?.id ?? '',
          wgs84Lat: z?.vTpopKmlsById?.nodes?.[0]?.wgs84Lat ?? '',
          wgs84Long: z?.vTpopKmlsById?.nodes?.[0]?.wgs84Long ?? '',
          url: z?.vTpopKmlsById?.nodes?.[0]?.url ?? '',
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
          data: sortBy(rows, ['art', 'label']),
          fileName: 'Teilpopulationen',
          kml: true,
        })
        setQueryState(undefined)
      }}
    >
      {`Teilpopulationen für Google Earth (beschriftet mit PopNr/TPopNr)`}
      {queryState ? (
        <span className={styles.progress}>{queryState}</span>
      ) : null}
    </Button>
  )
}
