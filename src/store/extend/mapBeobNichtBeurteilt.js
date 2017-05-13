// @flow
import { extendObservable, computed } from 'mobx'

import getBeobNichtBeurteiltBounds from '../action/getBeobNichtBeurteiltBounds'
import getBeobNichtBeurteiltMarkersClustered
  from '../action/getBeobNichtBeurteiltMarkersClustered'
import getBeobNichtBeurteiltMarkers
  from '../action/getBeobNichtBeurteiltMarkers'
import getBeobForMap from '../action/getBeobForMap'

export default (store: Object): void => {
  extendObservable(store.map.beobNichtBeurteilt, {
    highlightedIds: computed(
      () => {
        const mapFilterBeobNichtBeurteilt =
          store.map.mapFilter.beobNichtBeurteilt
        if (mapFilterBeobNichtBeurteilt.length > 0) {
          return mapFilterBeobNichtBeurteilt
        }
        if (store.tree.activeNodes.beobzuordnung) {
          return [store.tree.activeNodes.beobzuordnung]
        }
        return []
      },
      { name: 'mapBeobNichtBeurteiltHighlightedIds' },
    ),
    markersClustered: computed(
      () => getBeobNichtBeurteiltMarkersClustered(store),
      { name: 'mapBeobNichtBeurteiltMarkersClustered' },
    ),
    markers: computed(() => getBeobNichtBeurteiltMarkers(store), {
      name: 'mapBeobNichtBeurteiltMarkers',
    }),
    beobs: computed(
      () =>
        getBeobForMap(store).filter(
          b =>
            !b.beobzuordnung ||
            (!b.beobzuordnung.BeobNichtZuordnen && !b.beobzuordnung.TPopId),
        ),
      { name: 'mapBeobNichtBeurteiltBeobs' },
    ),
    bounds: computed(
      () => getBeobNichtBeurteiltBounds(store.map.beobNichtBeurteilt.beobs),
      { name: 'mapBeobNichtBeurteiltBounds' },
    ),
    boundsOfHighlightedIds: computed(
      () =>
        getBeobNichtBeurteiltBounds(
          store.map.beobNichtBeurteilt.beobs.filter(b =>
            store.map.beobNichtBeurteilt.highlightedIds.includes(b.id),
          ),
        ),
      { name: 'mapBeobNichtBeurteiltBoundsOfHighlightedIds' },
    ),
    idOfBeobBeingAssigned: 0,
  })
}
