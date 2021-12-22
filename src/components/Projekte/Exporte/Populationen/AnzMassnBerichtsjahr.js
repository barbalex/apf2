import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const PopulationenExports = () => {
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
            query: await import('./queryPopmassnberAnzMassns').then(
              (m) => m.default,
            ),
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
        const rows = (result?.data?.allPopmassnbers?.nodes ?? []).map((n) => ({
          ap_id: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apId ?? '',
          artname: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.artname ?? '',
          ap_bearbeitung:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apBearbeitung ?? '',
          ap_start_jahr:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apStartJahr ?? '',
          ap_umsetzung:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.apUmsetzung ?? '',
          pop_id: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popId ?? '',
          pop_nr: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popNr ?? '',
          pop_name: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popName ?? '',
          pop_status: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popStatus ?? '',
          pop_bekannt_seit:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popBekanntSeit ?? '',
          pop_status_unklar:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popStatusUnklar ?? '',
          pop_status_unklar_begruendung:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]
              ?.popStatusUnklarBegruendung ?? '',
          pop_x: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popX ?? '',
          pop_y: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popY ?? '',
          pop_created_at:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popCreatedAt ?? '',
          pop_updated_at:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popUpdatedAt ?? '',
          pop_changed_by:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.popChangedBy ?? '',
          id: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.id ?? '',
          jahr: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.jahr ?? '',
          entwicklung:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.entwicklung ?? '',
          bemerkungen:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.bemerkungen ?? '',
          created_at: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.createdAt ?? '',
          updated_at: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.updatedAt ?? '',
          changed_by: n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.changedBy ?? '',
          anzahl_massnahmen:
            n?.vPopmassnberAnzmassnsById?.nodes?.[0]?.anzahlMassnahmen ?? '',
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
        console.log('Populationen export', { rows, data: result?.data })
        exportModule({
          data: sortBy(rows, ['artname', 'pop_nr', 'jahr']),
          fileName: 'PopulationenAnzMassnProMassnber',
          idKey: 'pop_id',
          xKey: 'pop_wgs84lat',
          yKey: 'pop_wgs84long',
          store,
        })
        setQueryState(undefined)
      }}
    >
      {`Populationen mit Massnahmen-Berichten: Anzahl Massnahmen im Berichtsjahr`}
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(PopulationenExports)
