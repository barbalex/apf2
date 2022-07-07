import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'

import exportModule from '../../../../modules/export'
import storeContext from '../../../../storeContext'
import { DownloadCardButton, StyledProgressText } from '../index'

const Ap = ({ treeName }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { enqueNotification, tableIsFiltered } = store
  const { apGqlFilter } = store[treeName]

  const [queryState, setQueryState] = useState()

  const onClickAp = useCallback(async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await client.query({
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
          filter: apGqlFilter,
        },
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
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
      return enqueNotification({
        message: 'Die Abfrage retournierte 0 Datensätze',
        options: {
          variant: 'warning',
        },
      })
    }
    exportModule({
      data: rows,
      fileName: 'Art',
      store,
    })
    setQueryState(undefined)
  }, [apGqlFilter, client, enqueNotification, store])

  const apIsFiltered = tableIsFiltered({
    treeName,
    table: 'ap',
  })

  return (
    <DownloadCardButton
      onClick={onClickAp}
      color="inherit"
      disabled={!!queryState}
    >
      {apIsFiltered ? 'Arten (gefiltert)' : 'Arten'}
      {queryState ? (
        <StyledProgressText>{queryState}</StyledProgressText>
      ) : null}
    </DownloadCardButton>
  )
}

export default observer(Ap)
