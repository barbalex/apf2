import { memo, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router'

import { Polyline } from './Polyline.jsx'
import { StoreContext } from '../../../../../storeContext.js'
import { query } from './query.js'

const Polylines = memo(
  observer(() => {
    const store = useContext(StoreContext)
    const { enqueNotification } = store
    const { beobGqlFilter } = store.tree

    const { data, error } = useQuery(query, {
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
      <Polyline
        key={beob.id}
        beob={beob}
      />
    ))
  }),
)

export const BeobZugeordnetAssignPolylines = memo(
  observer(() => {
    const store = useContext(StoreContext)
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
  }),
)
