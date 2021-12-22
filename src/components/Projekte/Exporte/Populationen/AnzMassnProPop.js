import React, { useContext, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const AnzMassnProPop = () => {
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
              query popAnzMassnsQuery {
                allPops {
                  nodes {
                    id
                    vPopAnzmassnsById {
                      nodes {
                        apId
                        artname
                        apBearbeitung
                        apStartJahr
                        apUmsetzung
                        id
                        nr
                        name
                        status
                        bekanntSeit
                        statusUnklar
                        statusUnklarBegruendung
                        x
                        y
                        anzahlMassnahmen
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
          ap_id: z?.vPopAnzmassnsById?.nodes?.[0]?.apId ?? '',
          artname: z?.vPopAnzmassnsById?.nodes?.[0]?.artname ?? '',
          ap_bearbeitung: z?.vPopAnzmassnsById?.nodes?.[0]?.apBearbeitung ?? '',
          ap_start_jahr: z?.vPopAnzmassnsById?.nodes?.[0]?.apStartJahr ?? '',
          ap_umsetzung: z?.vPopAnzmassnsById?.nodes?.[0]?.apUmsetzung ?? '',
          id: z?.vPopAnzmassnsById?.nodes?.[0]?.id ?? '',
          nr: z?.vPopAnzmassnsById?.nodes?.[0]?.nr ?? '',
          name: z?.vPopAnzmassnsById?.nodes?.[0]?.name ?? '',
          status: z?.vPopAnzmassnsById?.nodes?.[0]?.status ?? '',
          bekannt_seit: z?.vPopAnzmassnsById?.nodes?.[0]?.bekanntSeit ?? '',
          status_unklar: z?.vPopAnzmassnsById?.nodes?.[0]?.statusUnklar ?? '',
          status_unklar_begruendung:
            z?.vPopAnzmassnsById?.nodes?.[0]?.statusUnklarBegruendung ?? '',
          x: z?.vPopAnzmassnsById?.nodes?.[0]?.x ?? '',
          y: z?.vPopAnzmassnsById?.nodes?.[0]?.y ?? '',
          anzahl_massnahmen:
            z?.vPopAnzmassnsById?.nodes?.[0]?.anzahlMassnahmen ?? '',
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
          fileName: 'PopulationenAnzahlMassnahmen',
          store,
        })
        setQueryState(undefined)
      }}
    >
      Anzahl Massnahmen pro Population
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(AnzMassnProPop)
