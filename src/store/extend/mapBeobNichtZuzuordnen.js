// @flow
import { extendObservable, computed } from 'mobx'

import getBeobNichtZuzuordnenBounds from '../action/getBeobNichtZuzuordnenBounds'
import getBeobForMap from '../action/getBeobForMap'

export default (store: Object): void => {
  extendObservable(store.map.beobNichtZuzuordnen, {
    highlightedIds: computed(() => {
      const mapFilterBeobNichtZuzuordnen =
        store.map.mapFilter.beobNichtZuzuordnen
      if (mapFilterBeobNichtZuzuordnen.length > 0) {
        return mapFilterBeobNichtZuzuordnen
      }
      if (store.tree.activeNodes.beobNichtZuzuordnen) {
        return [store.tree.activeNodes.beobNichtZuzuordnen]
      }
      return []
    }),
    beobs: computed(() => getBeobForMap(store).filter(b => b.nicht_zuordnen)),
    boundsOfHighlightedIds: computed(() =>
      getBeobNichtZuzuordnenBounds(
        store.map.beobNichtZuzuordnen.beobs.filter(b =>
          store.map.beobNichtZuzuordnen.highlightedIds.includes(b.id)
        )
      )
    ),
  })
}
