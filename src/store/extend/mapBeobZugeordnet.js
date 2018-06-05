// @flow
import { extendObservable, computed } from 'mobx'

import getBeobForMap from '../action/getBeobForMap'

export default (store: Object): void => {
  extendObservable(store.map.beobZugeordnet, {
    highlightedIds: computed(
      () => {
        const { activeNodes } = store.tree
        const mapFilterBeobZugeordnet = store.map.mapFilter.beobZugeordnet
        if (mapFilterBeobZugeordnet.length > 0) {
          return mapFilterBeobZugeordnet
        }
        if (activeNodes.beobZugeordnet) {
          return [activeNodes.beobZugeordnet]
        } else if (activeNodes.tpop) {
          return store.map.beobZugeordnet.beobs
            .filter(b => !b.nicht_zuordnen && b.tpop_id === activeNodes.tpop)
            .map(b => b.id)
        } else if (activeNodes.pop) {
          return store.map.beobZugeordnet.beobs
            .filter(b => {
              if (!b.nicht_zuordnen && b.tpop_id) {
                const tpop = store.table.tpop.get(b.tpop_id)
                if (tpop) {
                  const popId = tpop.pop_id
                  return popId && popId === activeNodes.pop
                }
                return false
              }
              return false
            })
            .map(b => b.id)
        }
        return []
      }
    ),
    beobs: computed(
      () =>
        getBeobForMap(store).filter(b => {
          const beob = store.table.beob.get(b.id)
          return beob && !beob.nicht_zuordnen && beob.tpop_id
        })
    ),
  })
}
