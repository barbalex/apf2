// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

import getBeobNichtBeurteiltBounds from '../modules/getBeobNichtBeurteiltBounds'
import getBeobNichtBeurteiltMarkersClustered from '../modules/getBeobNichtBeurteiltMarkersClustered'
import getBeobNichtBeurteiltMarkers from '../modules/getBeobNichtBeurteiltMarkers'
import getBeobForMap from '../modules/getBeobForMap'

export default (store:Object) => {
  extendObservable(store.map.beobNichtBeurteilt, {
    highlightedIds: computed(
      () => {
        const nodeMapFilterBeobNichtBeurteilt = store.node.nodeMapFilter.beobNichtBeurteilt
        if (nodeMapFilterBeobNichtBeurteilt.length > 0) {
          return nodeMapFilterBeobNichtBeurteilt
        }
        if (store.activeUrlElements.beobzuordnung) {
          return [store.activeUrlElements.beobzuordnung]
        }
        return []
      },
      { name: `mapBeobNichtBeurteiltHighlightedIds` }
    ),
    markersClustered: computed(
      () => getBeobNichtBeurteiltMarkersClustered(store),
      { name: `mapBeobNichtBeurteiltMarkersClustered` }
    ),
    markers: computed(
      () => getBeobNichtBeurteiltMarkers(store),
      { name: `mapBeobNichtBeurteiltMarkers` }
    ),
    beobs: computed(
      () => getBeobForMap(store).filter(b =>
        !b.beobzuordnung ||
        (!b.beobzuordnung.BeobNichtZuordnen && !b.beobzuordnung.TPopId)
      ),
      { name: `mapBeobNichtBeurteiltBeobs` }
    ),
    bounds: computed(
      () => getBeobNichtBeurteiltBounds(store.map.beobNichtBeurteilt.beobs),
      { name: `mapBeobNichtBeurteiltBounds` }
    ),
    boundsOfHighlightedIds: computed(
      () => getBeobNichtBeurteiltBounds(
        store.map.beobNichtBeurteilt.beobs
          .filter(b => store.map.beobNichtBeurteilt.highlightedIds.includes(b.BeobId))
      ),
      { name: `mapBeobNichtBeurteiltBoundsOfHighlightedIds` }
    ),
    idOfBeobBeingAssigned: 0,
  })
}
