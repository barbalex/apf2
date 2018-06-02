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
    bounds: [[47.159, 8.354], [47.696, 8.984]],
    changeBounds: action(bounds => (store.map.bounds = bounds)),
    fetchDetailplaene: action(() =>
      fetchDetailplaene(store)
    ),
    fetchMarkierungen: action(() =>
      fetchMarkierungen(store)
    ),
    activeApfloraLayers: [],
    addActiveApfloraLayer: action(layer =>
      store.map.activeApfloraLayers.push(layer)
    ),
    removeActiveApfloraLayer: action(layer => {
      store.map.activeApfloraLayers = store.map.activeApfloraLayers.filter(
        o => o !== layer
      )
    }),
    showMapApfloraLayer: action((layer, bool) => {
      if (bool) {
        store.map.addActiveApfloraLayer(layer)
      } else {
        store.map.removeActiveApfloraLayer(layer)
      }
    }),
    setIdOfTpopBeingLocalized: action(id => {
      store.map.tpop.idOfTpopBeingLocalized = id
    }),
    setMapMouseCoord: action(e => {
      store.map.mouseCoord = [e.latlng.lng, e.latlng.lat]
    }),
    toggleMapPopLabelContent: action(
      layer => (store.map[layer].labelUsingNr = !store.map[layer].labelUsingNr)
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
