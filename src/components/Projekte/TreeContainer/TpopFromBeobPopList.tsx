import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import { useParams, useLocation } from 'react-router'

import { createNewTpopFromBeob } from '../../../modules/createNewTpopFromBeob.ts'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'

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

export const TpopFromBeobPopList = ({ closeNewTpopFromBeobDialog, beobId }) => {
  const { projId, apId } = useParams()
  const { search } = useLocation()

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
  const { data } = useQuery({
    queryKey: ['popsForTpopFromBeob', apId],
    queryFn: async () => {
      const result = await apolloClient.query<AllPopsQueryResult>({
        query,
        variables: { apId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

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
}
