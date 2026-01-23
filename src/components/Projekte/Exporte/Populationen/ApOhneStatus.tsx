import { useContext, useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'
import { MobxContext } from '../../../../mobxContext.ts'

import type { ApId } from '../../../../models/apflora/public/ApId.ts'
import type { PopId } from '../../../../models/apflora/public/PopId.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface PopVonApOhneStatusQueryResult {
  allPops: {
    nodes: {
      id: PopId
      vPopVonapohnestatusesById: {
        nodes: {
          apId: ApId
          artname: string | null
          apBearbeitung: string | null
          id: PopId
          nr: number | null
          name: string | null
          status: string | null
          x: number | null
          y: number | null
        }[]
      }
    }[]
  }
}

export const ApOhneStatus = observer(() => {
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
        let result: { data: PopVonApOhneStatusQueryResult }
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
          addNotification({
            message: (error as Error).message,
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
          return addNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({
          data: sortBy(rows, ['artname', 'nr']),
          fileName: 'PopulationenVonApArtenOhneStatus',
        })
        setQueryState(undefined)
      }}
    >
      Populationen von AP-Arten ohne Status
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
})
