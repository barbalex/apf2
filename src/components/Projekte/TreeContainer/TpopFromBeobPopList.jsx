/**
 * need to keep class because of ref
 */
import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { observer } from 'mobx-react-lite'
import { useParams, useLocation } from 'react-router-dom'

import storeContext from '../../../storeContext'
import createNewTpopFromBeob from '../../../modules/createNewTpopFromBeob'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Error from '../../shared/Error'
import Spinner from '../../shared/Spinner'

const StyledListItem = styled(ListItem)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TpopFromBeobPopList = ({ closeNewTpopFromBeobDialog, beobId }) => {
  const { projId, apId } = useParams()
  const { search } = useLocation()

  const client = useApolloClient()
  const store = useContext(storeContext)

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
          <StyledListItem
            key={pop.id}
            button
            onClick={() => {
              createNewTpopFromBeob({
                pop,
                beobId,
                projId,
                apId,
                client,
                store,
                search,
              })
              closeNewTpopFromBeobDialog()
            }}
          >
            {pop.label}
          </StyledListItem>
        ))}
      </List>
    </ErrorBoundary>
  )
}

export default observer(TpopFromBeobPopList)
