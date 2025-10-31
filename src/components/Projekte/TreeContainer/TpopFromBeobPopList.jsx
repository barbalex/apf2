import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import { observer } from 'mobx-react-lite'
import { useParams, useLocation } from 'react-router'

import { MobxContext } from '../../../mobxContext.js'
import { createNewTpopFromBeob } from '../../../modules/createNewTpopFromBeob.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { Error } from '../../shared/Error.jsx'
import { Spinner } from '../../shared/Spinner.jsx'

import { listItem } from './TpopFromBeobPopList.module.css'

export const TpopFromBeobPopList = observer(
  ({ closeNewTpopFromBeobDialog, beobId }) => {
    const { projId, apId } = useParams()
    const { search } = useLocation()

    const store = useContext(MobxContext)

    const apolloClient = useApolloClient()

    const query = gql`
      query allPopsQueryForTpopFromBeobPopList($apId: UUID!) {
        allPops(
          filter: { apId: { equalTo: $apId } }
          orderBy: [NR_ASC, NAME_ASC]
        ) {
          nodes {
            id
            label
          }
        }
      }
    `
    const { data, error, loading } = useQuery(query, {
      variables: { apId },
    })

    if (loading) return <Spinner />

    if (error) return <Error error={error} />

    const pops = data?.allPops?.nodes ?? []

    return (
      <ErrorBoundary>
        <List dense>
          {pops.map((pop) => (
            <ListItemButton
              key={pop.id}
              onClick={() => {
                createNewTpopFromBeob({
                  pop,
                  beobId,
                  projId,
                  apId,
                  apolloClient,
                  store,
                  search,
                })
                closeNewTpopFromBeobDialog()
              }}
              className={listItem}
            >
              {pop.label}
            </ListItemButton>
          ))}
        </List>
      </ErrorBoundary>
    )
  },
)
