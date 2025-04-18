import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import { useParams } from 'react-router'
// import { useMap } from 'react-leaflet'

import { Marker } from './Marker.jsx'
import { MobxContext } from '../../../../../mobxContext.js'
import { query } from './query.js'

const iconCreateFunction = function (cluster) {
  const markers = cluster.getAllChildMarkers()
  const hasHighlightedBeob = markers.some(
    (m) => m.options.icon.options.className === 'beobIconHighlighted',
  )
  const className =
    hasHighlightedBeob ? 'beobClusterHighlighted' : 'beobCluster'

  return window.L.divIcon({
    html: markers.length,
    className,
    iconSize: window.L.point(40, 40),
  })
}

const BeobNichtBeurteiltMarker = memo(
  observer(({ clustered }) => {
    // const leafletMap = useMap()
    const store = useContext(MobxContext)
    const { enqueNotification } = store
    const tree = store.tree
    const { beobGqlFilter } = tree

    const { data, error } = useQuery(query, {
      variables: {
        beobFilter: beobGqlFilter('nichtBeurteilt').filtered,
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const [refetchProvoker, setRefetchProvoker] = useState(1)
    // useEffect(() => {
    //   // DO NOT use:
    //   // leafletMap.on('zoomend dragend', refetch
    //   // see: https://github.com/apollographql/apollo-client/issues/1291#issuecomment-367911441
    //   // Also: leafletMap.on('zoomend dragend', ()=> refetch()) never refetches!!??
    //   // Also: use dragend, not moveend because moveend fires on zoomend as well
    //   leafletMap.on('zoomend dragend', () => setRefetchProvoker(Math.random()))
    //   return () => {
    //     leafletMap.off('zoomend dragend', () => setRefetchProvoker(Math.random()))
    //   }
    // }, [leafletMap])

    if (error) {
      enqueNotification({
        message: `Fehler beim Laden der Nicht beurteilten Beobachtungen für die Karte: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }

    const beobMarkers = (data?.allBeobs?.nodes ?? []).map((beob) => (
      <Marker
        key={beob.id}
        beob={beob}
      />
    ))

    if (clustered) {
      return (
        <MarkerClusterGroup
          maxClusterRadius={66}
          iconCreateFunction={iconCreateFunction}
        >
          {beobMarkers}
        </MarkerClusterGroup>
      )
    }
    return beobMarkers
  }),
)

export const BeobNichtBeurteilt = memo(
  observer(({ clustered }) => {
    const store = useContext(MobxContext)
    const tree = store.tree
    const { beobGqlFilter } = tree

    const { apId } = useParams()

    // Problem: gqlFilter updates AFTER apId
    // if navigating from ap to pop, apId is set before gqlFilter
    // thus query fetches data for all aps
    // Solution: do not return pop if apId exists but gqlFilter does not contain it (yet)
    const gqlFilterHasApId =
      !!beobGqlFilter('nichtBeurteilt').filtered?.aeTaxonomyByArtId
        ?.apartsByArtId?.some?.apId
    const apIdExistsButGqlFilterDoesNotKnowYet = !!apId && !gqlFilterHasApId

    if (apIdExistsButGqlFilterDoesNotKnowYet) return null

    return <BeobNichtBeurteiltMarker clustered={clustered} />
  }),
)
