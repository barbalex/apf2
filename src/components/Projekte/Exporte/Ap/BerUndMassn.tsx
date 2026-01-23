import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import { ApId, AdresseId } from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface ApApberUndMassnsQueryResult {
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
      vApApberundmassnsById?: {
        nodes: Array<{
          id: ApId
          massnJahr?: number
          massnAnzahl?: number
          massnAnzahlBisher?: number
          berichtErstellt?: boolean
        }>
      }
      createdAt?: string
      updatedAt?: string
      changedBy?: string
    }>
  }
}

export const BerUndMassn = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickApBerUndMassn = async () => {
    setQueryState('lade Daten...')
    let result: { data?: ApApberUndMassnsQueryResult }
    try {
      result = await apolloClient.query<ApApberUndMassnsQueryResult>({
        query: gql`
          query ApApberUndMassnsForExportQuery {
            allAps(orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC) {
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
                vApApberundmassnsById {
                  nodes {
                    id
                    massnJahr
                    massnAnzahl
                    massnAnzahlBisher
                    berichtErstellt
                  }
                }
                createdAt
                updatedAt
                changedBy
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
      artname: z?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z.startJahr,
      ap_umsetzung: z?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.adresseByBearbeiter?.name ?? '',
      artwert: z?.aeTaxonomyByArtId?.artwert ?? '',
      massn_jahr: z?.vApApberundmassnsById?.nodes?.[0]?.massnJahr ?? '',
      massn_anzahl: z?.vApApberundmassnsById?.nodes?.[0]?.massnAnzahl ?? '',
      massn_anzahl_bisher:
        z?.vApApberundmassnsById?.nodes?.[0]?.massnAnzahlBisher ?? '',
      bericht_erstellt:
        z?.vApApberundmassnsById?.nodes?.[0]?.berichtErstellt ?? '',
      created_at: z.createdAt,
      updated_at: z.updatedAt,
      changed_by: z.changedBy,
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
    exportModule({ data: rows, fileName: 'ApJahresberichteUndMassnahmen' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickApBerUndMassn}
      color="inherit"
      disabled={!!queryState}
    >
      AP-Berichte und Massnahmen
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
