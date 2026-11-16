import { useQuery } from '@tanstack/react-query'
import { useStore } from 'jotai'
import type { UseQueryOptions } from '@tanstack/react-query'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import { useParams, useLocation } from 'react-router'
import { apiFetch } from '../../../modules/api.ts'

import { createNewTpopFromBeob } from '../../../modules/createNewTpopFromBeob.ts'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'

import type { PopId } from '../../../models/apflora/index.ts'

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

// react-query v5 omitted suspense from the public useQuery options
type PopsForTpopFromBeobQueryOptions = UseQueryOptions<
  AllPopsQueryResult | undefined,
  Error
> & {
  suspense: boolean
}

export const TpopFromBeobPopList = ({
  closeNewTpopFromBeobDialog,
  beobId,
}: {
  closeNewTpopFromBeobDialog: () => void
  beobId: string | null | undefined
}) => {
  const store = useStore()
  const { projId, apId } = useParams()
  const { search } = useLocation()

  const queryOptions: PopsForTpopFromBeobQueryOptions = {
    queryKey: ['popsForTpopFromBeob', apId],
    queryFn: async () => {
      const nodes =
        (await apiFetch<{ id: string; label: string | null }[]>(
          `/q_pop?ap_id=eq.${apId ?? ''}&select=id,label&order=nr.asc,name.asc`,
        )) ?? []
      return { allPops: { nodes } } as AllPopsQueryResult
    },
    suspense: true,
  }
  const { data } = useQuery(queryOptions)

  const pops = data?.allPops?.nodes ?? []

  return (
    <ErrorBoundary>
      <List dense>
        {pops.map((pop) => (
          <ListItemButton
            key={pop.id}
            onClick={() => {
              void createNewTpopFromBeob({
                store,
                pop,
                beobId: beobId ?? '',
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
