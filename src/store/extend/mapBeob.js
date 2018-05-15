// @flow
import { extendObservable, computed, action } from 'mobx'

import getBeobForMap from '../action/getBeobForMap'

export default (store: Object): void => {
  extendObservable(store.map.beob, {
    highlightedIds: [],
    beobs: computed(() => getBeobForMap(store), { name: 'mapBeobBeobs' }),
    assigning: false,
    toggleAssigning: action(
      'toggleAssigning',
      () => (store.map.beob.assigning = !store.map.beob.assigning),
    ),
  })
}
