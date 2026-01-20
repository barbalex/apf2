import { useContext, useState } from 'react'
import { useSetAtom } from 'jotai'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'
import { MobxContext } from '../../../../mobxContext.ts'

import { ApId } from '../../../../models/apflora/index.tsx'

import styles from '../index.module.css'

import {
  addNotificationAtom,
} from '../../../../JotaiStore/index.ts'


interface ApQueryResult {
  allAps: {
    nodes: Array<{
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
      createdAt?: string
      updatedAt?: string
      changedBy?: string
    }>
  }
}

interface ApProps {
  filtered?: boolean
}

export const Ap = observer(({ filtered = false }: ApProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const store = useContext(MobxContext)
  const { tableIsFiltered } = store
  const { apGqlFilter } = store.tree

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickAp = async () => {
    setQueryState('lade Daten...')
    let result: { data?: ApQueryResult }
    try {
      result = await apolloClient.query<ApQueryResult>({
        query: gql`
          query apForExportQuery($filter: ApFilter) {
            allAps(
              filter: $filter
              orderBy: AE_TAXONOMY_BY_ART_ID__ARTNAME_ASC
            ) {
              nodes {
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
                createdAt
                updatedAt
                changedBy
              }
            }
          }
        `,
        variables: {
          filter: filtered ? apGqlFilter.filtered : { or: [] },
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
    const rows = (result.data?.allAps?.nodes ?? []).map((n) => ({
      id: n.id,
      artname: n?.aeTaxonomyByArtId?.artname ?? null,
      bearbeitung: n?.apBearbstandWerteByBearbeitung?.text ?? null,
      startJahr: n.startJahr,
      umsetzung: n?.apUmsetzungWerteByUmsetzung?.text ?? null,
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
      fileName: `Arten${filtered ? '_gefiltert' : ''}`,
      store,
      apolloClient,
    })
    setQueryState(undefined)
  }

  const apIsFiltered = tableIsFiltered('ap')

  return (
    <Button
      className={styles.button}
      onClick={onClickAp}
      color="inherit"
      disabled={!!queryState || (filtered && !apIsFiltered)}
    >
      {filtered ? 'Arten (gefiltert)' : 'Arten'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
})
