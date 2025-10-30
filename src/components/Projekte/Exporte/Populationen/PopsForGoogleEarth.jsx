import { useContext, useState } from 'react'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import { button, progress } from '../index.module.css'

export const PopsForGoogleEarth = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result
        try {
          result = await apolloClient.query({
            query: gql`
              query popKmlQuery {
                allPops(filter: { vPopKmlsByIdExist: true }) {
                  nodes {
                    id
                    vPopKmlsById {
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
            options: {
              variant: 'error',
            },
          })
        }
        setQueryState('verarbeite...')
        const rows = (result?.data?.allPops?.nodes ?? []).map((z) => ({
          art: z?.vPopKmlsById?.nodes?.[0]?.art ?? '',
          label: z?.vPopKmlsById?.nodes?.[0]?.label ?? '',
          inhalte: z?.vPopKmlsById?.nodes?.[0]?.inhalte ?? '',
          id: z?.vPopKmlsById?.nodes?.[0]?.id ?? '',
          wgs84Lat: z?.vPopKmlsById?.nodes?.[0]?.wgs84Lat ?? '',
          wgs84Long: z?.vPopKmlsById?.nodes?.[0]?.wgs84Long ?? '',
          url: z?.vPopKmlsById?.nodes?.[0]?.url ?? '',
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
          fileName: 'Populationen',
          store,
          kml: true,
          apolloClient,
        })
        setQueryState(undefined)
      }}
    >
      {`Populationen für Google Earth (beschriftet mit PopNr)`}
      {queryState ?
        <span className={progress}>{queryState}</span>
      : null}
    </Button>
  )
})
