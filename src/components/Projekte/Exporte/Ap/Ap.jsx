import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import Button from '@mui/material/Button'
import { useApolloClient } from '@apollo/client/react'

import { exportModule } from '../../../../modules/export.js'
import { MobxContext } from '../../../../mobxContext.js'

import { StyledProgressText } from '../index.jsx'
import { button } from '../index.module.css'

export const Ap = observer(({ filtered = false }) => {
  const store = useContext(MobxContext)
  const { enqueNotification, tableIsFiltered } = store
  const { apGqlFilter } = store.tree

  const apolloClient = useApolloClient()

  const [queryState, setQueryState] = useState()

  const onClickAp = async () => {
    setQueryState('lade Daten...')
    let result
    try {
      result = await apolloClient.query({
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
      fileName: `Arten${filtered ? '_gefiltert' : ''}`,
      store,
      apolloClient,
    })
    setQueryState(undefined)
  }

  const apIsFiltered = tableIsFiltered('ap')

  return (
    <Button
      className={button}
      onClick={onClickAp}
      color="inherit"
      disabled={!!queryState || (filtered && !apIsFiltered)}
    >
      {filtered ? 'Arten (gefiltert)' : 'Arten'}
      {queryState ?
        <StyledProgressText>{queryState}</StyledProgressText>
      : null}
    </Button>
  )
})
