// @flow
import {
  extendObservable,
  computed,
  action,
} from 'mobx'

import getBeobMarkersClustered from '../modules/getBeobMarkersClustered'
import getBeobMarkers from '../modules/getBeobMarkers'
import getBeobForMap from '../modules/getBeobForMap'

export default (store:Object) => {
  extendObservable(store.map.beob, {
    highlightedIds: [],
    beobs: computed(() =>
      getBeobForMap(store),
      { name: `mapBeobBeobs` }
    ),
    markersClustered: computed(
      () => getBeobMarkersClustered(store),
      { name: `mapBeobMarkersClustered` }
    ),
    markers: computed(
      () => getBeobMarkers(store),
      { name: `mapBeobMarkers` }
    ),
    assigning: false,
    toggleAssigning: action(`toggleAssigning`, () =>
      store.map.beob.assigning = !store.map.beob.assigning
    ),
  })
}
