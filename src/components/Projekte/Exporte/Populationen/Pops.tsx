import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treePopGqlFilterAtom,
} from '../../../../store/index.ts'

export const Pops = ({ filtered = false }) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const popGqlFilter = useAtomValue(treePopGqlFilterAtom)

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const popIsFiltered = tableIsFiltered({ table: 'pop' })

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState || (filtered && !popIsFiltered)}
      onClick={async () => {
        setQueryState('lade Daten...')
        let result: { data: PopQueryResult }
        try {
          result = await apolloClient.query({
            query: gql`
              query popForExportQuery($filter: PopFilter) {
                allPops(
                  filter: $filter
                  orderBy: [AP_BY_AP_ID__LABEL_ASC, NR_ASC]
                ) {
                  nodes {
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
                    }
                    id
                    nr
                    name
                    popStatusWerteByStatus {
                      id
                      text
                    }
                    bekanntSeit
                    statusUnklar
                    statusUnklarBegruendung
                    x: lv95X
                    y: lv95Y
                    createdAt
                    updatedAt
                    changedBy
                  }
                }
              }
            `,
            variables: {
              filter: filtered ? popGqlFilter.filtered : { or: [] },
            },
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
        const rows = (result?.data?.allPops?.nodes ?? []).map((n) => ({
          apId: n?.apByApId?.id ?? null,
          apArtname: n?.apByApId?.aeTaxonomyByArtId?.artname ?? null,
          apBearbeitung:
            n?.apByApId?.apBearbstandWerteByBearbeitung?.text ?? null,
          apStartJahr: n?.apByApId?.startJahr ?? null,
          apUmsetzung: n?.apByApId?.apUmsetzungWerteByUmsetzung?.text ?? null,
          id: n.id,
          nr: n.nr,
          name: n.name,
          status: n?.popStatusWerteByStatus?.text ?? null,
          bekanntSeit: n.bekanntSeit,
          statusUnklar: n.statusUnklar,
          statusUnklarBegruendung: n.statusUnklarBegruendung,
          x: n.x,
          y: n.y,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          changedBy: n.changedBy,
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
          data: rows,
          fileName: `Populationen${filtered ? '_gefiltert' : ''}`,
        })
        setQueryState(undefined)
      }}
    >
      {filtered ? 'Populationen (gefiltert)' : 'Populationen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
