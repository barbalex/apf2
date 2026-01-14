import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient, useQuery } from '@apollo/client/react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import { observer } from 'mobx-react-lite'
import { useParams, useLocation } from 'react-router'

import { MobxContext } from '../../../mobxContext.ts'
import { createNewTpopFromBeob } from '../../../modules/createNewTpopFromBeob.ts'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { Error } from '../../shared/Error.tsx'
import { Spinner } from '../../shared/Spinner.tsx'

import type { PopId } from '../../../models/apflora/public/Pop.ts'

import styles from './TpopFromBeobPopList.module.css'

interface PopNode {
  id: PopId
  label: string | null
}

interface AllPopsQueryResult {
  allPops: {
    nodes: PopNode[]
  }
}

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
    const { data, error, loading } = useQuery<AllPopsQueryResult>(query, {
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
              className={styles.listItem}
            >
              {pop.label}
            </ListItemButton>
          ))}
        </List>
      </ErrorBoundary>
    )
  },
)
