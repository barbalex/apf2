import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import { ApId, AdresseId } from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface ApPopEkPrioQueryResult {
  allAps: {
    nodes: Array<{
      id: ApId
      aeTaxonomyByArtId?: {
        id: string
        artname?: string
        artwert?: number
      }
      apBearbstandWerteByBearbeitung?: {
        id: number
        text?: string
      }
      startJahr?: number
      apUmsetzungWerteByUmsetzung?: {
        id: number
        text?: string
      }
      adresseByBearbeiter?: {
        id: AdresseId
        name?: string
      }
      vApPopEkPriosByApId?: {
        nodes: Array<{
          id: ApId
          jahrZuvor?: number
          jahrZuletzt?: number
          anzPopUrsprZuvor?: number
          anzPopAngesZuvor?: number
          anzPopAktuellZuvor?: number
          anzPopUrsprZuletzt?: number
          anzPopAngesZuletzt?: number
          anzPopAktuellZuletzt?: number
          diffPopUrspr?: number
          diffPopAnges?: number
          diffPopAktuell?: number
          beurteilungZuletzt?: number
        }>
      }
    }>
  }
}

export const PriorisierungFuerEk = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickApPopEkPrio = async () => {
    setQueryState('lade Daten...')
    let result: { data?: ApPopEkPrioQueryResult }
    try {
      result = await apolloClient.query<ApPopEkPrioQueryResult>({
        query: gql`
          query apPopEkPrioForExportQuery {
            allAps(
              orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC
              filter: { bearbeitung: { lessThan: 4 } } #@485
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
      addNotification({
        message: (error as Error).message,
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
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({ data: rows, fileName: 'ApPriorisierungFuerEk' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickApPopEkPrio}
      color="inherit"
      disabled={!!queryState}
    >
      Priorisierung für EK basierend auf Pop-Entwicklung
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
