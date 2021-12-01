/**
 * need to keep class because of ref
 */
import React, { useContext } from 'react'
import styled from 'styled-components'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../storeContext'
import createNewTpopFromBeob from '../../../modules/createNewTpopFromBeob'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Error from '../../shared/Error'

const LoadingContainer = styled.div`
  padding: 10px;
`
const StyledListItem = styled(ListItem)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TpopFromBeobPopList = ({
  treeName,
  closeNewTpopFromBeobDialog,
  beobId,
}) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const tree = store[treeName]
  const { activeNodeArray } = tree
  const apId = activeNodeArray[3]

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

  if (loading) return <LoadingContainer>Lade Daten...</LoadingContainer>
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
                treeName,
                pop,
                beobId,
                client,
                store,
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
