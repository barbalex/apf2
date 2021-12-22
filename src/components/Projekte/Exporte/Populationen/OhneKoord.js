import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const OhneKoord = () => {
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
            query: await import('./queryPopOhneKoords').then((m) => m.default),
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
          ap_id: z?.vPopOhnekoordsById?.nodes?.[0]?.apId ?? '',
          artname: z?.vPopOhnekoordsById?.nodes?.[0]?.artname ?? '',
          ap_bearbeitung:
            z?.vPopOhnekoordsById?.nodes?.[0]?.apBearbeitung ?? '',
          ap_start_jahr: z?.vPopOhnekoordsById?.nodes?.[0]?.apStartJahr ?? '',
          ap_umsetzung: z?.vPopOhnekoordsById?.nodes?.[0]?.apUmsetzung ?? '',
          id: z?.vPopOhnekoordsById?.nodes?.[0]?.id ?? '',
          nr: z?.vPopOhnekoordsById?.nodes?.[0]?.nr ?? '',
          name: z?.vPopOhnekoordsById?.nodes?.[0]?.name ?? '',
          status: z?.vPopOhnekoordsById?.nodes?.[0]?.status ?? '',
          bekannt_seit: z?.vPopOhnekoordsById?.nodes?.[0]?.bekanntSeit ?? '',
          status_unklar: z?.vPopOhnekoordsById?.nodes?.[0]?.statusUnklar ?? '',
          status_unklar_begruendung:
            z?.vPopOhnekoordsById?.nodes?.[0]?.statusUnklarBegruendung ?? '',
          lv95X: z?.vPopOhnekoordsById?.nodes?.[0]?.x ?? '',
          lv95Y: z?.vPopOhnekoordsById?.nodes?.[0]?.y ?? '',
          created_at: z?.vPopOhnekoordsById?.nodes?.[0]?.createdAt ?? '',
          updated_at: z?.vPopOhnekoordsById?.nodes?.[0]?.updatedAt ?? '',
          changed_by: z?.vPopOhnekoordsById?.nodes?.[0]?.changedBy ?? '',
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
          fileName: 'PopulationenOhneKoordinaten',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Populationen ohne Koordinaten
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(OhneKoord)
