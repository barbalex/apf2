// @flow
import { extendObservable, computed } from 'mobx'

import getBeobForMap from '../action/getBeobForMap'
import getBeobZugeordnetBounds from '../action/getBeobZugeordnetBounds'
import getBeobZugeordnetMarkersClustered from '../action/getBeobZugeordnetMarkersClustered'
import getBeobZugeordnetMarkers from '../action/getBeobZugeordnetMarkers'
import getBeobZugeordnetAssignPolylines from '../action/getBeobZugeordnetAssignPolylines'

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
      },
      { name: 'mapBeobZugeordnetHighlightedIds' }
    ),
    markersClustered: computed(() => getBeobZugeordnetMarkersClustered(store), {
      name: 'mapBeobZugeordnetMarkersClustered',
    }),
    markers: computed(() => getBeobZugeordnetMarkers(store), {
      name: 'mapBeobZugeordnetMarkers',
    }),
    assignPolylines: computed(() => getBeobZugeordnetAssignPolylines(store), {
      name: 'mapBeobZugeordnetAssignPolylines',
    }),
    beobs: computed(
      () =>
        getBeobForMap(store).filter(b => {
          const beob = store.table.beob.get(b.id)
          return beob && !beob.nicht_zuordnen && beob.tpop_id
        }),
      { name: 'mapBeobZugeordnetBeobs' }
    ),
    bounds: computed(
      () => getBeobZugeordnetBounds(store.map.beobZugeordnet.beobs),
      {
        name: 'mapBeobZugeordnetBounds',
      }
    ),
    boundsOfHighlightedIds: computed(
      () =>
        getBeobZugeordnetBounds(
          store.map.beobZugeordnet.beobs.filter(b =>
            store.map.beobZugeordnet.highlightedIds.includes(b.id)
          )
        ),
      { name: 'mapBeobZugeordnetBoundsOfHighlightedIds' }
    ),
  })
}
