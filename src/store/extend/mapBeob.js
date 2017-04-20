// @flow
import { extendObservable, computed, action } from 'mobx'

import getBeobMarkersClustered from '../action/getBeobMarkersClustered'
import getBeobMarkers from '../action/getBeobMarkers'
import getBeobForMap from '../action/getBeobForMap'

export default (store: Object): void => {
  extendObservable(store.map.beob, {
    highlightedIds: [],
    beobs: computed(() => getBeobForMap(store), { name: `mapBeobBeobs` }),
    markersClustered: computed(() => getBeobMarkersClustered(store), {
      name: `mapBeobMarkersClustered`
    }),
    markers: computed(() => getBeobMarkers(store), { name: `mapBeobMarkers` }),
    assigning: false,
    toggleAssigning: action(
      `toggleAssigning`,
      () => store.map.beob.assigning = !store.map.beob.assigning
    )
  })
}
