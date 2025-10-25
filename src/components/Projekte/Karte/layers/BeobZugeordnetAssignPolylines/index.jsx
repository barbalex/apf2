import { useContext } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { Polyline } from './Polyline.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { query } from './query.js'

const Polylines = observer(() => {
  const store = useContext(MobxContext)
  const { enqueNotification } = store
  const { beobGqlFilter } = store.tree

  const apolloClient = useApolloClient()

  const { data, error } = useQuery({
    queryKey: ['BeobAssignLinesQuery', beobGqlFilter('zugeordnet').filtered],
    queryFn: async () =>
      apolloClient.query({
        query: query,
        variables: { beobFilter: beobGqlFilter('zugeordnet').filtered },
        fetchPolicy: 'no-cache',
      }),
  })

  if (error) {
    enqueNotification({
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
})

export const BeobZugeordnetAssignPolylines = observer(() => {
  const store = useContext(MobxContext)
  const tree = store.tree
  const { beobGqlFilter } = tree

  const { apId } = useParams()

  // Problem: gqlFilter updates AFTER apId
  // if navigating from ap to pop, apId is set before gqlFilter
  // thus query fetches data for all aps
  // Solution: do not return pop if apId exists but gqlFilter does not contain it (yet)
  const gqlFilterHasApId =
    !!beobGqlFilter('zugeordnet').filtered?.aeTaxonomyByArtId?.apartsByArtId
      ?.some?.apId
  const apIdExistsButGqlFilterDoesNotKnowYet = !!apId && !gqlFilterHasApId

  if (apIdExistsButGqlFilterDoesNotKnowYet) return null

  return <Polylines />
})
