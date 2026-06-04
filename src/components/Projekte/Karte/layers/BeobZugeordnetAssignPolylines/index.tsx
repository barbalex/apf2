import { useAtomValue, useSetAtom } from 'jotai'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Polyline } from './Polyline.tsx'
import { query } from './query.ts'

import type { BeobId } from '../../../../../models/apflora/public/Beob.ts'
import type {
  TpopId,
  PopId,
} from '../../../../../models/apflora/public/Tpop.ts'
import type { AeTaxonomyId } from '../../../../../models/apflora/public/AeTaxonomy.ts'

import {
  addNotificationAtom,
  treeBeobGqlFilterAtom,
} from '../../../../../store/index.ts'

interface BeobAssignLinesNode {
  id: BeobId
  wgs84Lat: number
  wgs84Long: number
  lv95X: number | null
  lv95Y: number | null
  datum: string | null
  autor: string | null
  quelle: string | null
  aeTaxonomyByArtId: {
    id: AeTaxonomyId
    artname: string | null
  } | null
  tpopByTpopId: {
    id: TpopId
    popId: PopId
    nr: number | null
    flurname: string | null
    wgs84Lat: number | null
    wgs84Long: number | null
  } | null
}

interface BeobAssignLinesQueryResult {
  allBeobs: {
    nodes: BeobAssignLinesNode[]
  }
}

const Polylines = () => {
  const beobZugeordnetGqlFilter = useAtomValue(
    treeBeobGqlFilterAtom('zugeordnet'),
  )

  const apolloClient = useApolloClient()

  const { data, error } = useQuery({
    queryKey: ['BeobAssignLinesQuery', beobZugeordnetGqlFilter.filtered],
    queryFn: async () =>
      apolloClient.query({
        query: query,
        variables: { beobFilter: beobZugeordnetGqlFilter.filtered },
      }),
  })

  if (error) {
    addNotification({
      message: `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  return (data?.data?.allBeobs?.nodes ?? []).map((beob) => (
    <Polyline
      key={beob.id}
      beob={beob}
    />
  ))
}

export const BeobZugeordnetAssignPolylines = () => {
  const addNotification = useSetAtom(addNotificationAtom)
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
