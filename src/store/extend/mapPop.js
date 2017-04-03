// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

import getPopsForMap from '../action/getPopsForMap'
import getPopBounds from '../action/getPopBounds'
import getPopMarkers from '../action/getPopMarkers'

export default (store:Object) => {
  extendObservable(store.map.pop, {
    // apArtId is needed because
    // need to pass apArtId when activeNodes.ap
    // is not yet set...
    apArtId: null,
    highlightedIds: computed(
      () => {
        const mapFilterPop = store.map.mapFilter.pop
        if (mapFilterPop.length > 0) {
          return mapFilterPop
        }
        if (store.activeNodes.pop) {
          return [store.activeNodes.pop]
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
