// @flow
import { extendObservable, computed } from 'mobx'

import getPopBounds from '../action/getPopBounds'

export default (store: Object): void => {
  extendObservable(store.map.pop, {
    // apId is needed because
    // need to pass apId when activeNodes.ap
    // is not yet set...
    apId: null,
    highlightedIds: computed(
      () => {
        const mapFilterPop = store.map.mapFilter.pop
        if (mapFilterPop.length > 0) {
          return mapFilterPop
        }
        if (store.tree.activeNodes.pop) {
          // fetch pop and make sure it has coordinates
          const pop = store.table.pop.get(store.tree.activeNodes.pop)
          // ...but only once pop exists
          if (pop && pop.x && pop.y) {
            return [store.tree.activeNodes.pop]
          }
          return []
        }
        return []
      },
    ),
    pops: [],
    bounds: computed(() => getPopBounds(store.map.pop.pops)),
    boundsOfHighlightedIds: computed(
      () =>
        getPopBounds(
          store.map.pop.pops.filter(p =>
            store.map.pop.highlightedIds.includes(p.id)
          )
        )
    ),
    // alternative is using names
    labelUsingNr: true,
  })
}
