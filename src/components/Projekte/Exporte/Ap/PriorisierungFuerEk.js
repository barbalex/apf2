import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const PriorisierungFuerEk = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const [queryState, setQueryState] = useState()

  const onClickApPopEkPrio = useCallback(async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await client.query({
        query: gql`
          query apPopEkPrioForExportQuery {
            allAps(
              orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC
              filter: { bearbeitung: { lessThan: 4 } }
            ) {
              nodes {
                id
                aeTaxonomyByArtId {
                  id
                  artname
                  artwert
                }
                apBearbstandWerteByBearbeitung {
                  id
                  text
                }
                startJahr
                apUmsetzungWerteByUmsetzung {
                  id
                  text
                }
                adresseByBearbeiter {
                  id
                  name
                }
                vApPopEkPriosByApId {
                  nodes {
                    id: apId
                    jahrZuvor
                    jahrZuletzt
                    anzPopUrsprZuvor
                    anzPopAngesZuvor
                    anzPopAktuellZuvor
                    anzPopUrsprZuletzt
                    anzPopAngesZuletzt
                    anzPopAktuellZuletzt
                    diffPopUrspr
                    diffPopAnges
                    diffPopAktuell
                    beurteilungZuletzt
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
    const rows = (result.data?.allAps?.nodes ?? []).map((z) => ({
      ap_id: z.id,
      artname: z?.aeTaxonomyByArtId.artname ?? '',
      ap_bearbeitung: z?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z.startJahr,
      ap_umsetzung: z?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.adresseByBearbeiter?.name ?? '',
      artwert: z?.aeTaxonomyByArtId?.artwert ?? '',
      jahr_zuvor: z?.vApPopEkPriosByApId?.nodes?.[0]?.jahrZuvor ?? '',
      jahr_zuletzt: z?.vApPopEkPriosByApId?.nodes?.[0]?.jahrZuletzt ?? '',
      anz_pop_urspr_zuvor:
        z?.vApPopEkPriosByApId?.nodes?.[0]?.anzPopUrsprZuvor ?? '',
      anz_pop_anges_zuvor:
        z?.vApPopEkPriosByApId?.nodes?.[0]?.anzPopAngesZuvor ?? '',

      anz_pop_aktuell_zuvor:
        z?.vApPopEkPriosByApId?.nodes?.[0]?.anzPopAktuellZuvor ?? '',
      anz_pop_ursp_zuletzt:
        z?.vApPopEkPriosByApId?.nodes?.[0]?.anzPopUrsprZuletzt ?? '',
      anz_pop_anges_zuletzt:
        z?.vApPopEkPriosByApId?.nodes?.[0]?.anzPopAngesZuletzt ?? '',
      anz_pop_aktuell_zuletzt:
        z?.vApPopEkPriosByApId?.nodes?.[0]?.anzPopAktuellZuletzt ?? '',
      diff_pop_urspr: z?.vApPopEkPriosByApId?.nodes?.[0]?.diffPopUrspr ?? '',
      diff_pop_anges: z?.vApPopEkPriosByApId?.nodes?.[0]?.diffPopAnges ?? '',
      diff_pop_aktuell:
        z?.vApPopEkPriosByApId?.nodes?.[0]?.diffPopAktuell ?? '',
      beurteilung_zuletzt:
        z?.vApPopEkPriosByApId?.nodes?.[0]?.beurteilungZuletzt ?? '',
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
      fileName: 'ApPriorisierungFuerEk',
      store,
    })
    setQueryState(undefined)
  }, [enqueNotification, client, store])

  return (
    <DownloadCardButton
      onClick={onClickApPopEkPrio}
      color="inherit"
      disabled={!!queryState}
    >
      Priorisierung für EK basierend auf Pop-Entwicklung
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(PriorisierungFuerEk)
