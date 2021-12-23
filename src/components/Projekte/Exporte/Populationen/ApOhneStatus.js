import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const ApOhneStatus = () => {
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
              query popVonApOhneStatusQuery {
                allPops(filter: { vPopVonapohnestatusesByIdExist: true }) {
                  nodes {
                    id
                    vPopVonapohnestatusesById {
                      nodes {
                        apId
                        artname
                        apBearbeitung
                        id
                        nr
                        name
                        status
                        x
                        y
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
          ap_id: z?.vPopVonapohnestatusesById?.nodes?.[0]?.apId ?? '',
          artname: z?.vPopVonapohnestatusesById?.nodes?.[0]?.artname ?? '',
          ap_bearbeitung:
            z?.vPopVonapohnestatusesById?.nodes?.[0]?.apBearbeitung ?? '',
          id: z?.vPopVonapohnestatusesById?.nodes?.[0]?.id ?? '',
          nr: z?.vPopVonapohnestatusesById?.nodes?.[0]?.nr ?? '',
          name: z?.vPopVonapohnestatusesById?.nodes?.[0]?.name ?? '',
          status: z?.vPopVonapohnestatusesById?.nodes?.[0]?.status ?? '',
          lv95X: z?.vPopVonapohnestatusesById?.nodes?.[0]?.x ?? '',
          lv95Y: z?.vPopVonapohnestatusesById?.nodes?.[0]?.y ?? '',
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
          data: sortBy(rows, ['artname', 'nr']),
          fileName: 'PopulationenVonApArtenOhneStatus',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Populationen von AP-Arten ohne Status
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(ApOhneStatus)
