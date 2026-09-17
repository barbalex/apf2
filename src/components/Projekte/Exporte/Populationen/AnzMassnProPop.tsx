import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { graphql } from '../../../../gql/index.ts'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { ApId, PopId } from '../../../../models/apflora/index.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface PopAnzMassnsQueryResult {
  allPops: {
    nodes: {
      id: PopId
      vPopAnzmassnsById: {
        nodes: {
          apId: ApId
          artname: string | null
          apBearbeitung: string | null
          apStartJahr: number | null
          apUmsetzung: string | null
          id: PopId
          nr: number | null
          name: string | null
          status: string | null
          bekanntSeit: number | null
          statusUnklar: boolean | null
          statusUnklarBegruendung: string | null
          x: number | null
          y: number | null
          anzahlMassnahmen: number | null
        }[]
      }
    }[]
  }
}

export const AnzMassnProPop = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickAnzMassnProPop = async () => {
    setQueryState('lade Daten...')
    let result: { data?: PopAnzMassnsQueryResult | undefined } | undefined
    try {
      result = await apolloClient.query<PopAnzMassnsQueryResult>({
        query: graphql(`
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
            `),
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
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    void exportModule({
      data: sortBy(rows, ['artname', 'nr']),
      fileName: 'PopulationenAnzahlMassnahmen',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickAnzMassnProPop()}
    >
      Anzahl Massnahmen pro Population
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
