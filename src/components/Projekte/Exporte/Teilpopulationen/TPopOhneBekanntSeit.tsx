import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { TpopId } from '../../../../models/apflora/public/TpopId.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface TPopOhnebekanntSeitQueryResult {
  allVTpopOhnebekanntseits: {
    nodes: {
      artname: string | null
      ap_bearbeitung: string | null
      pop_nr: number | null
      pop_name: string | null
      id: TpopId
      nr: number | null
      gemeinde: string | null
      flurname: string | null
      bekannt_seit: number | null
      lv95X: number | null
      lv95Y: number | null
    }[]
  }
}

export const TPopOhneBekanntSeit = () => {
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
        let result: { data: TPopOhnebekanntSeitQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query viewTpopOhnebekanntseits {
                allVTpopOhnebekanntseits {
                  nodes {
                    artname
                    ap_bearbeitung: apBearbeitung
                    pop_nr: popNr
                    pop_name: popName
                    id
                    nr
                    gemeinde
                    flurname
                    bekannt_seit: bekanntSeit
                    lv95X: x
                    lv95Y: y
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
        const rows = result.data?.allVTpopOhnebekanntseits?.nodes ?? []
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
          data: rows,
          fileName: 'TeilpopulationenVonApArtenOhneBekanntSeit',
        })
        setQueryState(undefined)
      }}
    >
      {'Teilpopulationen von AP-Arten ohne "Bekannt seit"'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
