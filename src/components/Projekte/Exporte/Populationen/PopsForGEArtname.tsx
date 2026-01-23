import { useContext, useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'
import { MobxContext } from '../../../../mobxContext.ts'

import type { PopId } from '../../../../models/apflora/public/PopId.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

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

export const PopsForGEArtname = observer(() => {
  const addNotification = useSetAtom(addNotificationAtom)
  const store = useContext(MobxContext)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result: { data: PopKmlNamenQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
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
        exportModule({
          data: sortBy(rows, ['art', 'label']),
          fileName: 'PopulationenNachNamen',
          store,
          kml: true,
        })
        setQueryState(undefined)
      }}
    >
      {`Populationen für Google Earth (beschriftet mit Artname, PopNr)`}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
})
