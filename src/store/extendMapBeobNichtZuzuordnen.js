// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

import getBeobNichtZuzuordnenBounds from '../modules/getBeobNichtZuzuordnenBounds'
import getBeobNichtZuzuordnenMarkersClustered from '../modules/getBeobNichtZuzuordnenMarkersClustered'
import getBeobForMap from '../modules/getBeobForMap'

export default (store:Object) => {
  extendObservable(store.map.beobNichtZuzuordnen, {
    highlightedIds: computed(
      () => {
        const nodeMapFilterBeobNichtZuzuordnen = store.node.nodeMapFilter.beobNichtZuzuordnen
        if (nodeMapFilterBeobNichtZuzuordnen.length > 0) {
          return nodeMapFilterBeobNichtZuzuordnen
        }
        if (store.activeUrlElements.beobNichtZuzuordnen) {
          return [store.activeUrlElements.beobNichtZuzuordnen]
        }
        return []
      },
      { name: `mapBeobNichtZuzuordnenHighlightedIds` }
    ),
    markersClustered: computed(
      () => getBeobNichtZuzuordnenMarkersClustered(store),
      { name: `mapBeobNichtZuzuordnenMarkersClustered` }
    ),
    beobs: computed(
      () => getBeobForMap(store)
        .filter(b => b.beobzuordnung && b.beobzuordnung.BeobNichtZuordnen === 1),
      { name: `mapBeobNichtZuzuordnenBeobs` }
    ),
    bounds: computed(
      () => getBeobNichtZuzuordnenBounds(store.map.beobNichtZuzuordnen.beobs),
    { name: `mapBeobNichtZuzuordnenBounds` }
    ),
    boundsOfHighlightedIds: computed(
      () => getBeobNichtZuzuordnenBounds(
        store.map.beobNichtZuzuordnen.beobs
          .filter(b =>
            store.map.beobNichtZuzuordnen.highlightedIds.includes(
              isNaN(b.BeobId) ? b.BeobId : Number(b.BeobId)
            )
          )
      ),
      { name: `mapBeobNichtZuzuordnenBoundsOfHighlightedIds` }
    ),
  })
}
