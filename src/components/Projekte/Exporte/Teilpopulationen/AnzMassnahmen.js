import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Teilpopulationen = () => {
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
            query: await import('./queryTpopAnzMassns').then((m) => m.default),
          })
        } catch (error) {
          enqueNotification({
            message: error.message,
            options: { variant: 'error' },
          })
        }
        setQueryState('verarbeite...')
        const rows = (result.data?.allTpops?.nodes ?? []).map((n) => ({
          ap_id: n?.vTpopAnzmassnsById?.nodes?.[0]?.apId ?? '',
          familie: n?.vTpopAnzmassnsById?.nodes?.[0]?.familie ?? '',
          artname: n?.vTpopAnzmassnsById?.nodes?.[0]?.artname ?? '',
          ap_bearbeitung:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.apBearbeitung ?? '',
          ap_start_jahr: n?.vTpopAnzmassnsById?.nodes?.[0]?.apStartJahr ?? '',
          ap_umsetzung: n?.vTpopAnzmassnsById?.nodes?.[0]?.apUmsetzung ?? '',
          pop_id: n?.vTpopAnzmassnsById?.nodes?.[0]?.popId ?? '',
          pop_nr: n?.vTpopAnzmassnsById?.nodes?.[0]?.popNr ?? '',
          pop_name: n?.vTpopAnzmassnsById?.nodes?.[0]?.popName ?? '',
          pop_status: n?.vTpopAnzmassnsById?.nodes?.[0]?.popStatus ?? '',
          pop_bekannt_seit:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.popBekanntSeit ?? '',
          pop_status_unklar:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.popStatusUnklar ?? '',
          pop_status_unklar_begruendung:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.popStatusUnklarBegruendung ?? '',
          pop_x: n?.vTpopAnzmassnsById?.nodes?.[0]?.popX ?? '',
          pop_y: n?.vTpopAnzmassnsById?.nodes?.[0]?.popY ?? '',
          id: n?.vTpopAnzmassnsById?.nodes?.[0]?.id ?? '',
          nr: n?.vTpopAnzmassnsById?.nodes?.[0]?.nr ?? '',
          gemeinde: n?.vTpopAnzmassnsById?.nodes?.[0]?.gemeinde ?? '',
          flurname: n?.vTpopAnzmassnsById?.nodes?.[0]?.flurname ?? '',
          status: n?.vTpopAnzmassnsById?.nodes?.[0]?.status ?? '',
          bekannt_seit: n?.vTpopAnzmassnsById?.nodes?.[0]?.bekanntSeit ?? '',
          status_unklar: n?.vTpopAnzmassnsById?.nodes?.[0]?.statusUnklar ?? '',
          status_unklar_grund:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.statusUnklarGrund ?? '',
          lv95X: n?.vTpopAnzmassnsById?.nodes?.[0]?.x ?? '',
          lv95Y: n?.vTpopAnzmassnsById?.nodes?.[0]?.y ?? '',
          radius: n?.vTpopAnzmassnsById?.nodes?.[0]?.radius ?? '',
          hoehe: n?.vTpopAnzmassnsById?.nodes?.[0]?.hoehe ?? '',
          exposition: n?.vTpopAnzmassnsById?.nodes?.[0]?.exposition ?? '',
          klima: n?.vTpopAnzmassnsById?.nodes?.[0]?.klima ?? '',
          neigung: n?.vTpopAnzmassnsById?.nodes?.[0]?.neigung ?? '',
          beschreibung: n?.vTpopAnzmassnsById?.nodes?.[0]?.beschreibung ?? '',
          kataster_nr: n?.vTpopAnzmassnsById?.nodes?.[0]?.katasterNr ?? '',
          apber_relevant:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.apberRelevant ?? '',
          apber_relevant_grund:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.apberRelevantGrund ?? '',
          eigentuemer: n?.vTpopAnzmassnsById?.nodes?.[0]?.eigentuemer ?? '',
          kontakt: n?.vTpopAnzmassnsById?.nodes?.[0]?.kontakt ?? '',
          nutzungszone: n?.vTpopAnzmassnsById?.nodes?.[0]?.nutzungszone ?? '',
          bewirtschafter:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.bewirtschafter ?? '',
          ekfrequenz: n?.vTpopAnzmassnsById?.nodes?.[0]?.ekfrequenz ?? '',
          ekfrequenz_abweichend:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.ekfrequenzAbweichend ?? '',
          anzahlMassnahmen:
            n?.vTpopAnzmassnsById?.nodes?.[0]?.anzahlMassnahmen ?? '',
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
          data: sortBy(rows, ['artname', 'pop_nr', 'nr']),
          fileName: 'TeilpopulationenAnzahlMassnahmen',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Anzahl Massnahmen pro Teilpopulation
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Teilpopulationen)
