import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { sortBy } from 'es-toolkit'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import { ApId, ErfkritId, AdresseId } from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import {
  addNotificationAtom,
} from '../../../../store/index.ts'


interface ErfkritsQueryResult {
  allErfkrits: {
    nodes: Array<{
      id: ErfkritId
      apId?: ApId
      apByApId?: {
        id: ApId
        aeTaxonomyByArtId?: {
          id: string
          artname?: string
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
      }
      apErfkritWerteByErfolg?: {
        id: number
        text?: string
      }
      kriterien?: string
      createdAt?: string
      updatedAt?: string
      changedBy?: string
    }>
  }
}

export const Erfkrit = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickErfkrit = async () => {
    setQueryState('lade Daten...')
    let result: { data?: ErfkritsQueryResult }
    try {
      result = await apolloClient.query<ErfkritsQueryResult>({
        query: gql`
          query erfkritsForExportQuery {
            allErfkrits {
              nodes {
                id
                apId
                apByApId {
                  id
                  aeTaxonomyByArtId {
                    id
                    artname
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
                }
                apErfkritWerteByErfolg {
                  id
                  text
                }
                kriterien
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
    const rows = (result.data?.allErfkrits?.nodes ?? []).map((z) => ({
      ap_id: z.apId,
      artname: z?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
      ap_bearbeitung: z?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? '',
      ap_start_jahr: z?.apByApId?.startJahr ?? '',
      ap_umsetzung: z?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? '',
      ap_bearbeiter: z?.apByApId?.adresseByBearbeiter?.name ?? '',
      id: z.id,
      beurteilung: z?.apErfkritWerteByErfolg?.text ?? '',
      kriterien: z.kriterien,
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
    exportModule({
      data: sortBy(rows, ['artname', 'beurteilung']),
      fileName: 'Erfolgskriterien',
    })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickErfkrit}
      color="inherit"
      disabled={!!queryState}
    >
      Erfolgskriterien
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
