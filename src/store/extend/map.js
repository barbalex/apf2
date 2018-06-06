// @flow
import { extendObservable, action } from 'mobx'

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
  })
}
