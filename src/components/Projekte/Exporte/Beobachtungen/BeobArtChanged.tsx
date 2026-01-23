import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import { BeobId } from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../JotaiStore/index.ts'

interface BeobArtChangedQueryResult {
  allVBeobArtChangeds: {
    nodes: Array<{
      id: BeobId
      quelle?: string
      id_field?: string
      original_id?: string
      art_id_original?: string
      artname_original?: string
      taxonomie_id_original?: string
      art_id?: string
      artname?: string
      taxonomie_id?: string
      pop_id?: string
      pop_nr?: number
      tpop_id?: string
      tpop_nr?: number
      tpop_status?: number
      tpop_gemeinde?: string
      tpop_flurname?: string
      lv95X?: number
      lv95Y?: number
      distanz_zur_teilpopulation?: number
      datum?: string
      autor?: string
      nicht_zuordnen?: boolean
      bemerkungen?: string
      created_at?: string
      updated_at?: string
      changed_by?: string
    }>
  }
}

export const BeobArtChanged = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const mapFilter = useAtomValue(treeMapFilterAtom)

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickButton = async () => {
    setQueryState('lade Daten...')
    let result: { data?: BeobArtChangedQueryResult }
    try {
      // view: v_beob_art_changed
      result =
        mapFilter ?
          await apolloClient.query<BeobArtChangedQueryResult>({
            query: gql`
              query allBeobsArtChangedFilteredByMap {
                allVBeobArtChangeds {
                  nodes {
                    id
                    quelle
                    id_field: idField
                    original_id: originalId
                    art_id_original: artIdOriginal
                    artname_original: artnameOriginal
                    taxonomie_id_original: taxonomieIdOriginal
                    art_id: artId
                    artname
                    taxonomie_id: taxonomieId
                    pop_id: popId
                    pop_nr: popNr
                    tpop_id: tpopId
                    tpop_nr: tpopNr
                    tpop_status: tpopStatus
                    tpop_gemeinde: tpopGemeinde
                    tpop_flurname: tpopFlurname
                    lv95X: x
                    lv95Y: y
                    distanz_zur_teilpopulation: distanzZurTeilpopulation
                    datum
                    autor
                    nicht_zuordnen: nichtZuordnen
                    bemerkungen
                    created_at: createdAt
                    updated_at: updatedAt
                    changed_by: changedBy
                  }
                }
              }
            `,
            variables: {
              filter: {
                geomPoint: {
                  coveredBy: mapFilter,
                },
              },
            },
          })
        : await apolloClient.query<BeobArtChangedQueryResult>({
            query: gql`
              query allBeobsArtChanged {
                allVBeobArtChangeds {
                  nodes {
                    id
                    quelle
                    id_field: idField
                    original_id: originalId
                    art_id_original: artIdOriginal
                    artname_original: artnameOriginal
                    taxonomie_id_original: taxonomieIdOriginal
                    art_id: artId
                    artname
                    taxonomie_id: taxonomieId
                    pop_id: popId
                    pop_nr: popNr
                    tpop_id: tpopId
                    tpop_nr: tpopNr
                    tpop_status: tpopStatus
                    tpop_gemeinde: tpopGemeinde
                    tpop_flurname: tpopFlurname
                    lv95X: x
                    lv95Y: y
                    distanz_zur_teilpopulation: distanzZurTeilpopulation
                    datum
                    autor
                    nicht_zuordnen: nichtZuordnen
                    bemerkungen
                    created_at: createdAt
                    updated_at: updatedAt
                    changed_by: changedBy
                  }
                }
              }
            `,
          })
    } catch (error) {
      setQueryState(undefined)
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    setQueryState('verarbeite...')
    const rows = result.data?.allVBeobArtChangeds?.nodes ?? []
    if (rows.length === 0) {
      setQueryState(undefined)
      return addNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({ data: rows, fileName: 'BeobachtungenArtVeraendert' })
    setQueryState(undefined)
  }

  return (
    <Button
      className={styles.button}
      onClick={onClickButton}
      color="inherit"
      disabled={!!queryState}
    >
      Alle Beobachtungen, bei denen die Art verändert wurde
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
