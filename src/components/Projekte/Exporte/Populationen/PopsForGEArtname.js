import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const PopsForGeArtname = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
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
          enqueNotification({
            message: error.message,
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
          return enqueNotification({
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
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(PopsForGeArtname)
