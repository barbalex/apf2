import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'

import Polyline from './Polyline'
import storeContext from '../../../../../storeContext'
import query from './query'

const Router = () => {
  const store = useContext(storeContext)
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

  return <ObservedBeobZugeordnetAssignPolylines />
}

const BeobZugeordnetAssignPolylines = () => {
  const store = useContext(storeContext)
  const { enqueNotification } = store
  const { beobGqlFilter } = store.tree

  var { data, error } = useQuery(query, {
    variables: { beobFilter: beobGqlFilter('zugeordnet').filtered },
  })

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Populationen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  return (data?.allBeobs?.nodes ?? []).map((beob) => (
    <Polyline key={beob.id} beob={beob} />
  ))
}

const ObservedBeobZugeordnetAssignPolylines = observer(
  BeobZugeordnetAssignPolylines,
)

export default observer(Router)
