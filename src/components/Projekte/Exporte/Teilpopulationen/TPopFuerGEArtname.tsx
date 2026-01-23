import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { TpopId } from '../../../../models/apflora/public/TpopId.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface TPopKmlNamenQueryResult {
  allTpops: {
    nodes: {
      id: TpopId
      vTpopKmlnamenById: {
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

export const TPopFuerGEArtname = () => {
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
        let result: { data: TPopKmlNamenQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query tpopKmlnamenQuery {
                allTpops(filter: { vTpopKmlnamenByIdExist: true }) {
                  nodes {
                    id
                    vTpopKmlnamenById {
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
          art: z?.vTpopKmlnamenById?.nodes?.[0]?.art ?? '',
          label: z?.vTpopKmlnamenById?.nodes?.[0]?.label ?? '',
          inhalte: z?.vTpopKmlnamenById?.nodes?.[0]?.inhalte ?? '',
          id: z?.vTpopKmlnamenById?.nodes?.[0]?.id ?? '',
          wgs84Lat: z?.vTpopKmlnamenById?.nodes?.[0]?.wgs84Lat ?? '',
          wgs84Long: z?.vTpopKmlnamenById?.nodes?.[0]?.wgs84Long ?? '',
          url: z?.vTpopKmlnamenById?.nodes?.[0]?.url ?? '',
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
          fileName: 'TeilpopulationenNachNamen',
          kml: true,
        })
        setQueryState(undefined)
      }}
    >
      {`Teilpopulationen für Google Earth (beschriftet mit Artname, PopNr/TPopNr)`}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
