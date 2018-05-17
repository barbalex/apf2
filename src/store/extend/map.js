// @flow
import { extendObservable, action, computed, observable } from 'mobx'
import sortBy from 'lodash/sortBy'

import epsg4326to2056 from '../../modules/epsg4326to2056'
import localizeTpop from '../action/localizeTpop'
import setActiveBaseLayer from '../action/setActiveBaseLayer'
import moveOverlay from '../action/moveOverlay'
import moveApfloraLayer from '../action/moveApfloraLayer'
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
    mouseCoord: [],
    mouseCoordEpsg2056: computed(
      () => {
        if (store.map.mouseCoord.length > 0) {
          return epsg4326to2056(
            store.map.mouseCoord[0],
            store.map.mouseCoord[1]
          )
        }
        return []
      }
    ),
    activeBaseLayer: 'OsmColor',
    setActiveBaseLayer: action(layer =>
      setActiveBaseLayer(store, layer)
    ),
    overlays: observable([
      { label: 'Markierungen', value: 'Markierungen' },
      { label: 'Detailpläne', value: 'Detailplaene' },
      { label: 'ZH Übersichtsplan', value: 'ZhUep' },
      { label: 'ZH Gemeindegrenzen', value: 'ZhGemeindegrenzen' },
      { label: 'SVO grau', value: 'ZhSvoGrey' },
      { label: 'SVO farbig', value: 'ZhSvoColor' },
      { label: 'Pflegeplan', value: 'ZhPflegeplan' },
      {
        label: 'Lebensraum- und Vegetationskartierungen',
        value: 'ZhLrVegKartierungen',
      },
      { label: 'Wälder: lichte', value: 'ZhLichteWaelder' },
      { label: 'Wälder: Vegetation', value: 'ZhWaelderVegetation' },
    ]),
    overlaysString: computed(
      () => store.map.overlays.map(o => o.value).join()
    ),
    moveOverlay: action(({ oldIndex, newIndex }) =>
      moveOverlay(store, oldIndex, newIndex)
    ),
    activeOverlays: [],
    activeOverlaysSorted: computed(
      () =>
        sortBy(store.map.activeOverlays, activeOverlay =>
          store.map.overlays.findIndex(
            overlay => overlay.value === activeOverlay
          )
        )
    ),
    activeOverlaysSortedString: computed(
      () => store.map.activeOverlaysSorted.join()
    ),
    addActiveOverlay: action(layer =>
      store.map.activeOverlays.push(layer)
    ),
    removeActiveOverlay: action(layer => {
      store.map.activeOverlays = store.map.activeOverlays.filter(
        o => o !== layer
      )
    }),
    fetchDetailplaene: action(() =>
      fetchDetailplaene(store)
    ),
    fetchMarkierungen: action(() =>
      fetchMarkierungen(store)
    ),
    apfloraLayers: observable([
      { label: 'Populationen', value: 'Pop' },
      { label: 'Teil-Populationen', value: 'Tpop' },
      { label: 'Beobachtungen: zugeordnet', value: 'BeobZugeordnet' },
      { label: 'Beobachtungen: nicht beurteilt', value: 'BeobNichtBeurteilt' },
      {
        label: 'Beobachtungen: nicht zuzuordnen',
        value: 'BeobNichtZuzuordnen',
      },
      { label: 'Zuordnungs-Linien', value: 'BeobZugeordnetAssignPolylines' },
      { label: 'Karten-Filter', value: 'MapFilter' },
    ]),
    apfloraLayersString: computed(
      () => store.map.apfloraLayers.map(o => o.value).join()
    ),
    moveApfloraLayer: action(({ oldIndex, newIndex }) =>
      moveApfloraLayer(store, oldIndex, newIndex)
    ),
    activeApfloraLayers: [],
    activeApfloraLayersSorted: computed(
      () =>
        sortBy(store.map.activeApfloraLayers, activeApfloraLayer =>
          store.map.apfloraLayers.findIndex(
            apfloraLayer => apfloraLayer.value === activeApfloraLayer
          )
        )
    ),
    activeApfloraLayersSortedString: computed(
      () => store.map.activeApfloraLayersSorted.join()
    ),
    addActiveApfloraLayer: action(layer =>
      store.map.activeApfloraLayers.push(layer)
    ),
    removeActiveApfloraLayer: action(layer => {
      store.map.activeApfloraLayers = store.map.activeApfloraLayers.filter(
        o => o !== layer
      )
    }),
    showMapLayer: action((layer, bool) => {
      if (bool) {
        store.map.addActiveOverlay(layer)
      } else {
        store.map.removeActiveOverlay(layer)
      }
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
    localizeTpop: action((tree, x, y) => {
      localizeTpop(store, tree, x, y)
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
