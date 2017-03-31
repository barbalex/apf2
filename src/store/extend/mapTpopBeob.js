// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

import getBeobForMap from '../action/getBeobForMap'
import getTpopBeobBounds from '../action/getTpopBeobBounds'
import getTpopBeobMarkersClustered from '../action/getTpopBeobMarkersClustered'
import getTpopBeobMarkers from '../action/getTpopBeobMarkers'
import getTpopBeobAssignPolylines from '../action/getTpopBeobAssignPolylines'

export default (store:Object) => {
  extendObservable(store.map.tpopBeob, {
    highlightedIds: computed(
      () => {
        const { activeUrlElements } = store
        const nodeMapFilterTpopBeob = store.node.nodeMapFilter.tpopBeob
        if (nodeMapFilterTpopBeob.length > 0) {
          return nodeMapFilterTpopBeob
        }
        if (activeUrlElements.tpopbeob) {
          return [activeUrlElements.tpopbeob]
        } else if (activeUrlElements.tpop) {
          return store.map.tpopBeob.beobs.filter(b =>
            b.beobzuordnung && b.beobzuordnung.TPopId === activeUrlElements.tpop
          ).map(b => b.BeobId)
        } else if (activeUrlElements.pop) {
          return store.map.tpopBeob.beobs.filter((b) => {
            const tpop = store.table.tpop.get(b.beobzuordnung.TPopId)
            if (tpop) {
              const popId = tpop.PopId
              return popId && popId === activeUrlElements.pop
            }
            return false
          }).map(b => b.BeobId)
        }
        return []
      },
      { name: `mapTpopBeobHighlightedIds` }
    ),
    markersClustered: computed(
      () => getTpopBeobMarkersClustered(store),
      { name: `mapTpopBeobMarkersClustered` }
    ),
    markers: computed(
      () => getTpopBeobMarkers(store),
      { name: `mapTpopBeobMarkers` }
    ),
    assignPolylines: computed(
      () => getTpopBeobAssignPolylines(store),
      { name: `mapTpopBeobAssignPolylines` }
    ),
    beobs: computed(
      () => getBeobForMap(store).filter(b =>
        b.beobzuordnung &&
        b.beobzuordnung.TPopId &&
        !b.beobzuordnung.BeobNichtZuzuordnen
      ),
      { name: `mapTpopBeobBeobs` }
    ),
    bounds: computed(
      () => getTpopBeobBounds(store.map.tpopBeob.beobs),
      { name: `mapTpopBeobBounds` }
    ),
    boundsOfHighlightedIds: computed(
      () => getTpopBeobBounds(
        store.map.tpopBeob.beobs
          .filter(b => store.map.tpopBeob.highlightedIds.includes(b.BeobId))
      ),
      { name: `mapTpopBeobBoundsOfHighlightedIds` }
    ),
  })
}
