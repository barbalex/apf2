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
        () => popIdsInsideFeatureCollection({mapFilter: store.map.mapFilter.filter, data: store.map.pop.pops})
      ),
      tpop: computed(
        () => tpopIdsInsideFeatureCollection({mapFilter: store.map.mapFilter.filter, data: store.map.tpop.tpops})
      ),
      beobNichtBeurteilt: computed(
        () =>
          beobNichtBeurteiltIdsInsideFeatureCollection({
            mapFilter: store.map.mapFilter.filter,
            data: store.map.beobNichtBeurteilt.beobs
          })
      ),
      beobNichtZuzuordnen: computed(
        () =>
          beobNichtZuzuordnenIdsInsideFeatureCollection({
            mapFilter: store.map.mapFilter.filter,
            data: store.map.beobNichtZuzuordnen.beobs
          })
      ),
      beobZugeordnet: computed(
        () =>
          beobZugeordnetIdsInsideFeatureCollection({
            mapFilter: store.map.mapFilter.filter,
            data: store.map.beobZugeordnet.beobs
          })
      ),
    },
  })
  extendObservable(store.map.mapFilter.filter, {
    features: [],
  })
}
