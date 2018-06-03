// @flow
import { extendObservable, computed } from 'mobx'

import getTpopBounds from '../action/getTpopBounds'

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
      }
    ),
    highlightedPopIds: [],
    tpops: [],
    bounds: computed(() => getTpopBounds(store.map.tpop.tpops)),
    boundsOfHighlightedIds: computed(
      () =>
        getTpopBounds(
          store.map.tpop.tpops.filter(t =>
            store.map.tpop.highlightedIds.includes(t.id)
          )
        )
    ),
    // alternative is using names
    labelUsingNr: true,
    idOfTpopBeingLocalized: 0,
  })
}
