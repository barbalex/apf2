// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

import getBeobNichtZuzuordnenBounds from '../action/getBeobNichtZuzuordnenBounds'
import getBeobNichtZuzuordnenMarkersClustered from '../action/getBeobNichtZuzuordnenMarkersClustered'
import getBeobForMap from '../action/getBeobForMap'

export default (store:Object) => {
  extendObservable(store.map.beobNichtZuzuordnen, {
    highlightedIds: computed(
      () => {
        const mapFilterBeobNichtZuzuordnen = store.map.mapFilter.beobNichtZuzuordnen
        if (mapFilterBeobNichtZuzuordnen.length > 0) {
          return mapFilterBeobNichtZuzuordnen
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
