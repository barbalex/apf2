// @flow
import { extendObservable, computed } from 'mobx'

import getBeobNichtZuzuordnenBounds from '../action/getBeobNichtZuzuordnenBounds'
import getBeobNichtZuzuordnenMarkersClustered from '../action/getBeobNichtZuzuordnenMarkersClustered'
import getBeobForMap from '../action/getBeobForMap'

export default (store: Object): void => {
  extendObservable(store.map.beobNichtZuzuordnen, {
    highlightedIds: computed(
      () => {
        const mapFilterBeobNichtZuzuordnen =
          store.map.mapFilter.beobNichtZuzuordnen
        if (mapFilterBeobNichtZuzuordnen.length > 0) {
          return mapFilterBeobNichtZuzuordnen
        }
        if (store.tree.activeNodes.beobNichtZuzuordnen) {
          return [store.tree.activeNodes.beobNichtZuzuordnen]
        }
        return []
      },
      { name: 'mapBeobNichtZuzuordnenHighlightedIds' }
    ),
    markersClustered: computed(
      () => getBeobNichtZuzuordnenMarkersClustered(store),
      { name: 'mapBeobNichtZuzuordnenMarkersClustered' }
    ),
    beobs: computed(
      () =>
        getBeobForMap(store).filter(b => {
          const tpopbeob = store.table.tpopbeob.get(b.id)
          return (
            tpopbeob &&
            tpopbeob.BeobNichtZuordnen &&
            tpopbeob.BeobNichtZuordnen === 1
          )
        }),
      { name: 'mapBeobNichtZuzuordnenBeobs' }
    ),
    bounds: computed(
      () => getBeobNichtZuzuordnenBounds(store.map.beobNichtZuzuordnen.beobs),
      { name: 'mapBeobNichtZuzuordnenBounds' }
    ),
    boundsOfHighlightedIds: computed(
      () =>
        getBeobNichtZuzuordnenBounds(
          store.map.beobNichtZuzuordnen.beobs.filter(b =>
            store.map.beobNichtZuzuordnen.highlightedIds.includes(b.beob_id)
          )
        ),
      { name: 'mapBeobNichtZuzuordnenBoundsOfHighlightedIds' }
    ),
  })
}
