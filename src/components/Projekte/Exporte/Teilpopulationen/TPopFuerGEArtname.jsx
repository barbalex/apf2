import { useContext, useState } from 'react'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import styles from '../index.module.css'

export const TPopFuerGEArtname = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
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
          enqueNotification({
            message: error.message,
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
          return enqueNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({
          data: sortBy(rows, ['art', 'label']),
          fileName: 'TeilpopulationenNachNamen',
          store,
          kml: true,
          apolloClient,
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
})
