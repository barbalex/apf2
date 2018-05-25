// @flow
import { extendObservable, computed } from 'mobx'

import getBeobNichtBeurteiltBounds from '../action/getBeobNichtBeurteiltBounds'
import getBeobForMap from '../action/getBeobForMap'

export default (store: Object): void => {
  extendObservable(store.map.beobNichtBeurteilt, {
    highlightedIds: computed(() => {
      const mapFilterBeobNichtBeurteilt =
        store.map.mapFilter.beobNichtBeurteilt
      if (mapFilterBeobNichtBeurteilt.length > 0) {
        return mapFilterBeobNichtBeurteilt
      }
      if (store.tree.activeNodes.beobNichtBeurteilt) {
        return [store.tree.activeNodes.beobNichtBeurteilt]
      }
      return []
    }),
    beobs: computed(() =>
      getBeobForMap(store).filter(b => {
        return !b.nicht_zuordnen && !b.tpop_id
      })
    ),
    bounds: computed(
      () => getBeobNichtBeurteiltBounds(store.map.beobNichtBeurteilt.beobs)
    ),
    boundsOfHighlightedIds: computed(() =>
      getBeobNichtBeurteiltBounds(
        store.map.beobNichtBeurteilt.beobs.filter(b =>
          store.map.beobNichtBeurteilt.highlightedIds.includes(b.id)
        )
      )
    ),
    idOfBeobBeingAssigned: 0,
  })
}
