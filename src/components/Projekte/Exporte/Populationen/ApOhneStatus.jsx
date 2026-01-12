import { useContext, useState } from 'react'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import styles from '../index.module.css'

export const ApOhneStatus = observer(() => {
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
          apolloClient,
        })
        setQueryState(undefined)
      }}
    >
      Populationen von AP-Arten ohne Status
      {queryState ?
        <span className={progress}>{queryState}</span>
      : null}
    </Button>
  )
})
