// @flow
import { extendObservable, action, computed } from 'mobx'

import tpopIdsInsideFeatureCollection from '../../modules/tpopIdsInsideFeatureCollection'
import popIdsInsideFeatureCollection from '../../modules/popIdsInsideFeatureCollection'
import beobNichtBeurteiltIdsInsideFeatureCollection from '../../modules/beobNichtBeurteiltIdsInsideFeatureCollection'
import beobNichtZuzuordnenIdsInsideFeatureCollection from '../../modules/beobNichtZuzuordnenIdsInsideFeatureCollection'
import beobZugeordnetIdsInsideFeatureCollection from '../../modules/beobZugeordnetIdsInsideFeatureCollection'
import fetchDetailplaene from '../action/fetchDetailplaene'
import fetchMarkierungen from '../action/fetchMarkierungen'

export default (store: Object): void => {
  extendObservable(store.map, {
    detailplaene: null,
    setDetailplaene: action(data => (store.map.detailplaene = data)),
    markierungen: null,
    setMarkierungen: action(data => (store.map.markierungen = data)),
    fetchDetailplaene: action(() =>
      fetchDetailplaene(store)
    ),
    fetchMarkierungen: action(() =>
      fetchMarkierungen(store)
    ),
    mapFilter: {
      filter: {
        features: [],
      },
      pop: computed(
        () => popIdsInsideFeatureCollection(store, store.map.pop.pops)
      ),
      tpop: computed(
        () => tpopIdsInsideFeatureCollection(store, store.map.tpop.tpops)
      ),
      beobNichtBeurteilt: computed(
        () =>
          beobNichtBeurteiltIdsInsideFeatureCollection(
            store,
            store.map.beobNichtBeurteilt.beobs
          )
      ),
      beobNichtZuzuordnen: computed(
        () =>
          beobNichtZuzuordnenIdsInsideFeatureCollection(
            store,
            store.map.beobNichtZuzuordnen.beobs
          )
      ),
      beobZugeordnet: computed(
        () =>
          beobZugeordnetIdsInsideFeatureCollection(
            store,
            store.map.beobZugeordnet.beobs
          )
      ),
    },
    updateMapFilter: action(mapFilterItems => {
      if (!mapFilterItems) {
        return (store.map.mapFilter.filter = { features: [] })
      }
      store.map.mapFilter.filter = mapFilterItems.toGeoJSON()
    }),
  })
  extendObservable(store.map.mapFilter.filter, {
    features: [],
  })
}
