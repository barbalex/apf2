// @flow
import { extendObservable, computed } from 'mobx'

import getBeobForMap from '../action/getBeobForMap'

export default (store: Object): void => {
  extendObservable(store.map.beob, {
    beobs: computed(() => getBeobForMap(store), { name: 'mapBeobBeobs' }),
  })
}
