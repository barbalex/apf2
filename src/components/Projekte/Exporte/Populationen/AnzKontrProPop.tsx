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

interface PopAnzKontrsQueryResult {
  allPops: {
    nodes: {
      id: PopId
      vPopAnzkontrsById: {
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
          anzahlKontrollen: number | null
        }[]
      }
    }[]
  }
}

export const AnzKontrProPop = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickAnzKontrProPop = async () => {
    setQueryState('lade Daten...')
    let result: { data?: PopAnzKontrsQueryResult | undefined } | undefined
    try {
      result = await apolloClient.query<PopAnzKontrsQueryResult>({
        query: graphql(`
              query popAnzKontrsQuery {
                allPops {
                  nodes {
                    id
                    vPopAnzkontrsById {
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
                        anzahlKontrollen
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
      ap_id: z?.vPopAnzkontrsById?.nodes?.[0]?.apId ?? '',
      artname: z?.vPopAnzkontrsById?.nodes?.[0]?.artname ?? '',
      ap_bearbeitung: z?.vPopAnzkontrsById?.nodes?.[0]?.apBearbeitung ?? '',
      ap_start_jahr: z?.vPopAnzkontrsById?.nodes?.[0]?.apStartJahr ?? '',
      ap_umsetzung: z?.vPopAnzkontrsById?.nodes?.[0]?.apUmsetzung ?? '',
      id: z?.vPopAnzkontrsById?.nodes?.[0]?.id ?? '',
      nr: z?.vPopAnzkontrsById?.nodes?.[0]?.nr ?? '',
      name: z?.vPopAnzkontrsById?.nodes?.[0]?.name ?? '',
      status: z?.vPopAnzkontrsById?.nodes?.[0]?.status ?? '',
      bekannt_seit: z?.vPopAnzkontrsById?.nodes?.[0]?.bekanntSeit ?? '',
      status_unklar: z?.vPopAnzkontrsById?.nodes?.[0]?.statusUnklar ?? '',
      status_unklar_begruendung:
        z?.vPopAnzkontrsById?.nodes?.[0]?.statusUnklarBegruendung ?? '',
      x: z?.vPopAnzkontrsById?.nodes?.[0]?.x ?? '',
      y: z?.vPopAnzkontrsById?.nodes?.[0]?.y ?? '',
      anzahl_kontrollen:
        z?.vPopAnzkontrsById?.nodes?.[0]?.anzahlKontrollen ?? '',
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
      fileName: 'PopulationenAnzahlKontrollen',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={() => void onClickAnzKontrProPop()}
    >
      Anzahl Kontrollen pro Population
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
