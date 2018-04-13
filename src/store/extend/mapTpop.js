// @flow
import { extendObservable, computed } from 'mobx'

import getTpopsForMap from '../action/getTpopsForMap'
import getTpopBounds from '../action/getTpopBounds'
import getTpopMarkers from '../action/getTpopMarkers'
import getTpopMarkersClustered from '../action/getTpopMarkersClustered'

export default (store: Object): void => {
  extendObservable(store.map.tpop, {
    highlightedIds: computed(
      () => {
        const mapFilterTpop = store.map.mapFilter.tpop
        if (mapFilterTpop.length > 0) {
          return mapFilterTpop
        }
        if (store.tree.activeNodes.tpop) {
          // fetch tpop and make sure it has coordinates
          const tpop = store.table.tpop.get(store.tree.activeNodes.tpop)
          // ...but only once tpop exists
          if (tpop && tpop.x && tpop.y) {
            return [store.tree.activeNodes.tpop]
          }
          return []
        }
        return []
      },
      { name: 'mapTpopHighlightedIds' }
    ),
    highlightedPopIds: [],
    tpops: computed(() => getTpopsForMap(store), { name: 'mapTpopTpops' }),
    bounds: computed(() => getTpopBounds(store.map.tpop.tpops), {
      name: 'mapTpopBounds',
    }),
    boundsOfHighlightedIds: computed(
      () =>
        getTpopBounds(
          store.map.tpop.tpops.filter(t =>
            store.map.tpop.highlightedIds.includes(t.id)
          )
        ),
      { name: 'mapTpopBoundsOfHighlightedIds' }
    ),
    // alternative is using names
    labelUsingNr: true,
    markers: computed(() => getTpopMarkers(store), { name: 'mapTpopMarkers' }),
    markersClustered: computed(() => getTpopMarkersClustered(store), {
      name: 'mapTpopMarkersClustered',
    }),
    idOfTpopBeingLocalized: 0,
  })
}
