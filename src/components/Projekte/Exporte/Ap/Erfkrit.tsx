import { useContext, useState } from 'react'
import { sortBy } from 'es-toolkit'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import { ApId, ErfkritId, AdresseId } from '../../../../models/apflora/index.ts'

import styles from '../index.module.css'

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

export const Erfkrit = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store

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
      enqueNotification({
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
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: sortBy(rows, ['artname', 'beurteilung']),
      fileName: 'Erfolgskriterien',
      store,
      apolloClient,
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
})
