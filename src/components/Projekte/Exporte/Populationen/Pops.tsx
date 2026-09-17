import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { graphql } from '../../../../gql/index.ts'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.ts'
import { tableIsFiltered } from '../../../../modules/tableIsFiltered.ts'

import type { ApId, PopId } from '../../../../models/apflora/index.ts'

import styles from '../index.module.css'

import {
  addNotificationAtom,
  treePopGqlFilterAtom,
} from '../../../../store/index.ts'

interface PopQueryResult {
  allPops: {
    nodes: {
      id: PopId
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
          name?: string
          usersByAdresseId?: {
            nodes: { email?: string }[]
          }
        }
      }
      nr?: number
      name?: string
      popStatusWerteByStatus?: {
        id: number
        text?: string
      }
      bekanntSeit?: number
      statusUnklar?: boolean
      statusUnklarBegruendung?: string
      x?: number
      y?: number
      createdAt: string
      updatedAt: string
      changedBy?: string
    }[]
  }
}

interface PopsProps {
  filtered?: boolean
}

export const Pops = ({ filtered = false }: PopsProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const popGqlFilter = useAtomValue(treePopGqlFilterAtom)

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState<string | undefined>()

  const onClickPops = async () => {
    setQueryState('lade Daten...')
    let result: { data?: PopQueryResult | undefined } | undefined
    try {
      result = await apolloClient.query<PopQueryResult>({
        query: graphql(`
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
                      adresseByBearbeiter {
                        name
                        usersByAdresseId {
                          nodes {
                            email
                          }
                        }
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
            `),
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
      avName: n?.apByApId?.adresseByBearbeiter?.name ?? null,
      avEmail:
        n?.apByApId?.adresseByBearbeiter?.usersByAdresseId?.nodes?.[0]
          ?.email ?? null,
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
    void exportModule({
      data: rows,
      fileName: `Populationen${filtered ? '_gefiltert' : ''}`,
    })
    setQueryState(undefined)
  }

  const popIsFiltered = tableIsFiltered({ table: 'pop' })

  return (
    <Button
      className={styles.button}
      color="inherit"
      disabled={!!queryState || (filtered && !popIsFiltered)}
      onClick={() => void onClickPops()}
    >
      {filtered ? 'Populationen (gefiltert)' : 'Populationen'}
      {queryState ?
        <span className={styles.progress}>{queryState}</span>
      : null}
    </Button>
  )
}
