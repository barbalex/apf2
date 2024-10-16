import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import { observer } from 'mobx-react-lite'
import { useParams, useLocation } from 'react-router-dom'

import storeContext from '../../../storeContext.js'
import createNewTpopFromBeob from '../../../modules/createNewTpopFromBeob'
import ErrorBoundary from '../../shared/ErrorBoundary.jsx'
import Error from '../../shared/Error.jsx'
import Spinner from '../../shared/Spinner.jsx'

const StyledListItem = styled(ListItem)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const StyledListItemButton = styled(ListItemButton)`
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
        {pops.map(pop => (
          <StyledListItemButton
            key={pop.id}
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
          </StyledListItemButton>
        ))}
      </List>
    </ErrorBoundary>
  )
}

export default observer(TpopFromBeobPopList)
