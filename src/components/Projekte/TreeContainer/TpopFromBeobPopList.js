/**
 * need to keep class because of ref
 */
import React, { useContext } from 'react'
import styled from 'styled-components'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { observer } from 'mobx-react-lite'
import gql from 'graphql-tag'
import get from 'lodash/get'

import storeContext from '../../../storeContext'
import createNewTpopFromBeob from '../../../modules/createNewTpopFromBeob'
import ErrorBoundary from '../../shared/ErrorBoundary'

const StyledList = styled(List)`
  overflow-y: auto;
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

  if (error) return error.message
  if (loading) return 'Lade Daten...'

  const pops = get(data, 'allPops.nodes', [])

  return (
    <ErrorBoundary>
      <StyledList dense>
        {pops.map((pop) => (
          <ListItem
            key={pop.id}
            button
            onClick={() => {
              createNewTpopFromBeob({ treeName, pop, beobId, client, store })
              closeNewTpopFromBeobDialog()
            }}
          >
            {pop.label}
          </ListItem>
        ))}
      </StyledList>
    </ErrorBoundary>
  )
}

export default observer(TpopFromBeobPopList)
