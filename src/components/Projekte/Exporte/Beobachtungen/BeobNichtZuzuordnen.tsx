import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'

import { BeobId } from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

interface BeobNichtZuzuordnenQueryResult {
  allVBeobNichtZuzuordnens: {
    nodes: Array<{
      id: BeobId
      quelle?: string
      id_field?: string
      original_id?: string
      art_id?: string
      art_id_original?: string
      artname?: string
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

export const BeobNichtZuzuordnen = () => {
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
        let result: { data?: BeobNichtZuzuordnenQueryResult }
        try {
          result = await apolloClient.query<BeobNichtZuzuordnenQueryResult>({
            query: gql`
              query allBeobsNichtZuzuordnenForExport {
                allVBeobNichtZuzuordnens {
                  nodes {
                    id
                    quelle
                    id_field: idField
                    original_id: originalId
                    art_id: artId
                    art_id_original: artIdOriginal
                    artname
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
        exportModule({
          data: result?.data?.allVBeobNichtZuzuordnens?.nodes ?? [],
          fileName: 'Beobachtungen',
        })
        setQueryState(undefined)
      }}
    >
      Alle nicht zuzuordnenden Beobachtungen
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
