// @flow
import { extendObservable, computed } from 'mobx'

import getBeobForMap from '../action/getBeobForMap'
import getTpopBeobBounds from '../action/getTpopBeobBounds'
import getTpopBeobMarkersClustered from '../action/getTpopBeobMarkersClustered'
import getTpopBeobMarkers from '../action/getTpopBeobMarkers'
import getTpopBeobAssignPolylines from '../action/getTpopBeobAssignPolylines'

export default (store: Object): void => {
  extendObservable(store.map.tpopBeob, {
    highlightedIds: computed(
      () => {
        const { activeNodes } = store.tree
        const mapFilterTpopBeob = store.map.mapFilter.tpopBeob
        if (mapFilterTpopBeob.length > 0) {
          return mapFilterTpopBeob
        }
        if (activeNodes.tpopbeob) {
          return [activeNodes.tpopbeob]
        } else if (activeNodes.tpop) {
          return store.map.tpopBeob.beobs
            .filter(b => {
              const tpopbeob = store.table.tpopbeob.get(b.id)
              return (
                tpopbeob &&
                !tpopbeob.BeobNichtZuordnen &&
                tpopbeob.TPopId === activeNodes.tpop
              )
            })
            .map(b => b.beob_id)
        } else if (activeNodes.pop) {
          return store.map.tpopBeob.beobs
            .filter(b => {
              const tpopbeob = store.table.tpopbeob.get(b.id)
              if (tpopbeob && !tpopbeob.BeobNichtZuordnen && tpopbeob.TPopId) {
                const tpop = store.table.tpop.get(tpopbeob.TPopId)
                if (tpop) {
                  const popId = tpop.PopId
                  return popId && popId === activeNodes.pop
                }
                return false
              }
              return false
            })
            .map(b => b.beob_id)
        }
        return []
      },
      { name: 'mapTpopBeobHighlightedIds' }
    ),
    markersClustered: computed(() => getTpopBeobMarkersClustered(store), {
      name: 'mapTpopBeobMarkersClustered',
    }),
    markers: computed(() => getTpopBeobMarkers(store), {
      name: 'mapTpopBeobMarkers',
    }),
    assignPolylines: computed(() => getTpopBeobAssignPolylines(store), {
      name: 'mapTpopBeobAssignPolylines',
    }),
    beobs: computed(
      () =>
        getBeobForMap(store).filter(b => {
          const tpopbeob = store.table.tpopbeob.get(b.id)
          return tpopbeob && !tpopbeob.BeobNichtZuordnen && tpopbeob.TPopId
        }),
      { name: 'mapTpopBeobBeobs' }
    ),
    bounds: computed(() => getTpopBeobBounds(store.map.tpopBeob.beobs), {
      name: 'mapTpopBeobBounds',
    }),
    boundsOfHighlightedIds: computed(
      () =>
        getTpopBeobBounds(
          store.map.tpopBeob.beobs.filter(b =>
            store.map.tpopBeob.highlightedIds.includes(
              isNaN(b.beob_id) ? b.beob_id : Number(b.beob_id)
            )
          )
        ),
      { name: 'mapTpopBeobBoundsOfHighlightedIds' }
    ),
  })
}
