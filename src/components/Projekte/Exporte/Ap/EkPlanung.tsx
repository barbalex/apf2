import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import { ApId } from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface EkPlanungNachAbrechnungstypQueryResult {
  allVEkPlanungNachAbrechnungstyps: {
    nodes: Array<{
      apId?: ApId
      artname?: string
      artverantwortlich?: string
      jahr?: number
      a?: number
      b?: number
      d?: number
      ekf?: number
    }>
  }
}

export const EkPlanung = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickEkPlanung = async () => {
    setQueryState('lade Daten...')
    let result: { data?: EkPlanungNachAbrechnungstypQueryResult }
    try {
      result = await apolloClient.query<EkPlanungNachAbrechnungstypQueryResult>(
        {
          query: gql`
            query ekPlanungNachAbrechnungstyps {
              allVEkPlanungNachAbrechnungstyps {
                nodes {
                  apId
                  artname
                  artverantwortlich
                  jahr
                  a
                  b
                  d
                  ekf
                }
              }
            }
          `,
        },
      )
    } catch (error) {
      addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const rows = (
      result.data?.allVEkPlanungNachAbrechnungstyps?.nodes ?? []
    ).map((z) => ({
      ap_id: z?.apId,
      artname: z?.artname ?? '',
      artverantwortlich: z?.artverantwortlich ?? '',
      jahr: z.jahr ?? '',
      a: z?.a ?? 0,
      b: z?.b ?? 0,
      d: z?.d ?? 0,
      ekf: z?.ekf ?? 0,
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
    exportModule({ data: rows, fileName: 'EkPlanungProJahrNachAbrechnungstyp' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickEkPlanung}
      color="inherit"
      disabled={!!queryState}
    >
      EK-Planung pro Jahr nach Abrechnungstyp
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
