import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const EkPlanung = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  const onClickEkPlanung = useCallback(async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await client.query({
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
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: rows,
      fileName: 'EkPlanungProJahrNachAbrechnungstyp',
      store,
    })
    setQueryState(undefined)
  }, [enqueNotification, client, store])

  return (
    <DownloadCardButton
      onClick={onClickEkPlanung}
      color="inherit"
      disabled={!!queryState}
    >
      EK-Planung pro Jahr nach Abrechnungstyp
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(EkPlanung)
