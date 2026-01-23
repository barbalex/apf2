import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import type { ApId } from '../../../../models/apflora/public/ApId.ts'
import type { PopId } from '../../../../models/apflora/public/PopId.ts'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface PopOhneKoordsQueryResult {
  allPops: {
    nodes: {
      id: PopId
      vPopOhnekoordsById: {
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
          createdAt: string | null
          updatedAt: string | null
          changedBy: string | null
        }[]
      }
    }[]
  }
}

export const OhneKoord = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result: { data: PopOhneKoordsQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query popOhneKoordsQuery {
                allPops(filter: { vPopOhnekoordsByIdExist: true }) {
                  nodes {
                    id
                    vPopOhnekoordsById {
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
                        createdAt
                        updatedAt
                        changedBy
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
          return addNotification({
            message: 'Die Abfrage retournierte 0 Datensätze',
            options: {
              variant: 'warning',
            },
          })
        }
        exportModule({
          data: sortBy(rows, ['artname', 'nr']),
          fileName: 'PopulationenOhneKoordinaten',
        })
        setQueryState(undefined)
      }}
    >
      Populationen ohne Koordinaten
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
