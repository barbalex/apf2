import { memo, useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'
import { DownloadCardButton, StyledProgressText } from '../index.jsx'

export const TPopFuerGoogleEarth = memo(
  observer(() => {
    const client = useApolloClient()
    const store = useContext(MobxContext)
    const { enqueNotification } = store

    const [queryState, setQueryState] = useState()

    return (
      <DownloadCardButton
        color="inherit"
        disabled={!!queryState}
        onClick={async () => {
          setQueryState('lade Daten...')
          let result
          try {
            result = await client.query({
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
            enqueNotification({
              message: error.message,
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
            return enqueNotification({
              message: 'Die Abfrage retournierte 0 Datensätze',
              options: {
                variant: 'warning',
              },
            })
          }
          exportModule({
            data: sortBy(rows, ['art', 'label']),
            fileName: 'Teilpopulationen',
            store,
            kml: true,
          })
          setQueryState(undefined)
        }}
      >
        {`Teilpopulationen für Google Earth (beschriftet mit PopNr/TPopNr)`}
        {queryState ?
          <StyledProgressText>{queryState}</StyledProgressText>
        : null}
      </DownloadCardButton>
    )
  }),
)
