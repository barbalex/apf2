// @flow
import { extendObservable, computed } from 'mobx'

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
  })
}
