import { useAtomValue, useSetAtom } from 'jotai'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Polyline } from './Polyline.tsx'
import type { BeobAssignLinesNode } from './Polyline.tsx'
import { query } from './query.ts'

import {
  addNotificationAtom,
  treeBeobGqlFilterAtom,
} from '../../../../../store/index.ts'

interface BeobAssignLinesQueryResult {
  allBeobs: {
    nodes: BeobAssignLinesNode[]
  }
}

const Polylines = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const beobZugeordnetGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('zugeordnet'),
  )

  const apolloClient = useApolloClient()

  const { data, error } = useQuery({
    queryKey: ['BeobAssignLinesQuery', beobZugeordnetGqlFilter.filtered],
    queryFn: async () => {
      const result = await apolloClient.query<BeobAssignLinesQueryResult>({
        query: query,
        variables: { beobFilter: beobZugeordnetGqlFilter.filtered },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  if (error) {
    addNotification({
      message: `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  return (data?.allBeobs?.nodes ?? []).map((beob) => (
    <Polyline
      key={beob.id}
      beob={beob}
    />
  ))
}

export const BeobZugeordnetAssignPolylines = () => {
  const beobZugeordnetGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('zugeordnet'),
  )

  const { apId } = useParams()

  // Problem: gqlFilter updates AFTER apId
  // if navigating from ap to pop, apId is set before gqlFilter
  // thus query fetches data for all aps
  // Solution: do not return pop if apId exists but gqlFilter does not contain it (yet)
  const gqlFilterHasApId =
    !!beobZugeordnetGqlFilter.filtered?.aeTaxonomyByArtId?.apartsByArtId?.some
      ?.apId
  const apIdExistsButGqlFilterDoesNotKnowYet = !!apId && !gqlFilterHasApId

  if (apIdExistsButGqlFilterDoesNotKnowYet) return null

  return <Polylines />
}
