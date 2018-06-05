// @flow
import { extendObservable, action, computed } from 'mobx'

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
        () => 'TO REMOVE'
      ),
      tpop: computed(
        () => 'TO REMOVE'
      ),
      beobNichtBeurteilt: computed(
        () => 'TO REMOVE'
      ),
      beobNichtZuzuordnen: computed(
        () => 'TO REMOVE'
      ),
      beobZugeordnet: computed(
        () => 'TO REMOVE'
      ),
    },
  })
  extendObservable(store.map.mapFilter.filter, {
    features: [],
  })
}
