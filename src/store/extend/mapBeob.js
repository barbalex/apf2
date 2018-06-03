// @flow
import { extendObservable } from 'mobx'

export default (store: Object): void => {
  extendObservable(store.map.beob, {
    highlightedIds: [],
  })
}
