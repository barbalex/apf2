// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

import getPopsForMap from '../../modules/getPopsForMap'
import getPopBounds from '../../modules/getPopBounds'
import getPopMarkers from '../../modules/getPopMarkers'

export default (store:Object) => {
  extendObservable(store.map.pop, {
    // apArtId is needed because
    // need to pass apArtId when activeUrlElements.ap
    // is not yet set...
    apArtId: null,
    highlightedIds: computed(
      () => {
        const nodeMapFilterPop = store.node.nodeMapFilter.pop
        if (nodeMapFilterPop.length > 0) {
          return nodeMapFilterPop
        }
        if (store.activeUrlElements.pop) {
          return [store.activeUrlElements.pop]
        }
        return []
      },
      { name: `highlightedIds` }
    ),
    pops: computed(() =>
      getPopsForMap(store),
      { name: `mapPops` }
    ),
    bounds: computed(() =>
      getPopBounds(store.map.pop.pops),
      { name: `mapPopBounds` }
    ),
    boundsOfHighlightedIds: computed(
      () => getPopBounds(
        store.map.pop.pops
          .filter(p => store.map.pop.highlightedIds.includes(p.PopId))
      ),
      { name: `mapPopBoundsOfHighlightedIds` }
    ),
    // alternative is using names
    labelUsingNr: true,
    markers: computed(() =>
      getPopMarkers(store),
      { name: `mapPopMarkers` }
    ),
  })
}
