import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { graphql } from '../../../../gql/index.ts'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { ApId } from '../../../../models/apflora/index.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface EkPlanungNachAbrechnungstypQueryResult {
  allVEkPlanungNachAbrechnungstyps: {
    nodes: {
      apId?: ApId
      artname?: string
      artverantwortlich?: string
      jahr?: number
      a?: number
      b?: number
      d?: number
      ekf?: number
    }[]
  }
}

export const EkPlanung = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickEkPlanung = async () => {
    setQueryState('lade Daten...')
    let result:
      | { data?: EkPlanungNachAbrechnungstypQueryResult | undefined }
      | undefined
    try {
      result = await apolloClient.query<EkPlanungNachAbrechnungstypQueryResult>(
        {
          query: graphql(`
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
          `),
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
      result?.data?.allVEkPlanungNachAbrechnungstyps?.nodes ?? []
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
    void exportModule({ data: rows, fileName: 'EkPlanungProJahrNachAbrechnungstyp' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={() => void onClickEkPlanung()}
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
