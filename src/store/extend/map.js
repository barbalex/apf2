// @flow
import { extendObservable, action, computed, observable } from 'mobx'
import sortBy from 'lodash/sortBy'

import epsg4326to21781 from '../../modules/epsg4326to21781'
import localizeTpop from '../action/localizeTpop'
import setActiveBaseLayer from '../action/setActiveBaseLayer'
import moveOverlay from '../action/moveOverlay'
import moveApfloraLayer from '../action/moveApfloraLayer'
import tpopIdsInsideFeatureCollection
  from '../../modules/tpopIdsInsideFeatureCollection'
import popIdsInsideFeatureCollection
  from '../../modules/popIdsInsideFeatureCollection'
import beobNichtBeurteiltIdsInsideFeatureCollection
  from '../../modules/beobNichtBeurteiltIdsInsideFeatureCollection'
import beobNichtZuzuordnenIdsInsideFeatureCollection
  from '../../modules/beobNichtZuzuordnenIdsInsideFeatureCollection'
import tpopBeobIdsInsideFeatureCollection
  from '../../modules/tpopBeobIdsInsideFeatureCollection'

export default (store: Object): void => {
  extendObservable(store.map, {
    bounds: [[47.159, 8.354], [47.696, 8.984]],
    changeBounds: action('changeBounds', bounds => (store.map.bounds = bounds)),
    mouseCoord: [],
    mouseCoordEpsg21781: computed(
      () => {
        if (store.map.mouseCoord.length > 0) {
          return epsg4326to21781(
            store.map.mouseCoord[0],
            store.map.mouseCoord[1],
          )
        }
        return []
      },
      { name: 'mouseCoordEpsg21781' },
    ),
    activeBaseLayer: 'OsmColor',
    setActiveBaseLayer: action('setActiveBaseLayer', layer =>
      setActiveBaseLayer(store, layer),
    ),
    overlays: observable([
      { label: 'ZH Übersichtsplan', value: 'ZhUep' },
      { label: 'Detailplaene', value: 'Detailplaene' },
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
      () => store.map.overlays.map(o => o.value).join(),
      { name: 'computed' },
    ),
    moveOverlay: action('moveOverlay', ({ oldIndex, newIndex }) =>
      moveOverlay(store, oldIndex, newIndex),
    ),
    activeOverlays: [],
    activeOverlaysSorted: computed(
      () =>
        sortBy(store.map.activeOverlays, activeOverlay =>
          store.map.overlays.findIndex(
            overlay => overlay.value === activeOverlay,
          ),
        ),
      { name: 'activeOverlaysSorted' },
    ),
    activeOverlaysSortedString: computed(
      () => store.map.activeOverlaysSorted.join(),
      { name: 'activeOverlaysSortedString' },
    ),
    addActiveOverlay: action('addActiveOverlay', layer =>
      store.map.activeOverlays.push(layer),
    ),
    removeActiveOverlay: action('removeActiveOverlay', layer => {
      store.map.activeOverlays = store.map.activeOverlays.filter(
        o => o !== layer,
      )
    }),
    apfloraLayers: observable([
      { label: 'Populationen', value: 'Pop' },
      { label: 'Teil-Populationen', value: 'Tpop' },
      { label: 'Beobachtungen: zugeordnet', value: 'TpopBeob' },
      { label: 'Beobachtungen: nicht beurteilt', value: 'BeobNichtBeurteilt' },
      {
        label: 'Beobachtungen: nicht zuzuordnen',
        value: 'BeobNichtZuzuordnen',
      },
      { label: 'Zuordnungs-Linien', value: 'TpopBeobAssignPolylines' },
      { label: 'Karten-Filter', value: 'MapFilter' },
    ]),
    apfloraLayersString: computed(
      () => store.map.apfloraLayers.map(o => o.value).join(),
      { name: 'apfloraLayersString' },
    ),
    moveApfloraLayer: action('moveApfloraLayer', ({ oldIndex, newIndex }) =>
      moveApfloraLayer(store, oldIndex, newIndex),
    ),
    activeApfloraLayers: [],
    activeApfloraLayersSorted: computed(
      () =>
        sortBy(store.map.activeApfloraLayers, activeApfloraLayer =>
          store.map.apfloraLayers.findIndex(
            apfloraLayer => apfloraLayer.value === activeApfloraLayer,
          ),
        ),
      { name: 'activeApfloraLayersSorted' },
    ),
    activeApfloraLayersSortedString: computed(
      () => store.map.activeApfloraLayersSorted.join(),
      { name: 'activeApfloraLayersSortedString' },
    ),
    addActiveApfloraLayer: action('addActiveApfloraLayer', layer =>
      store.map.activeApfloraLayers.push(layer),
    ),
    removeActiveApfloraLayer: action('removeActiveApfloraLayer', layer => {
      store.map.activeApfloraLayers = store.map.activeApfloraLayers.filter(
        o => o !== layer,
      )
    }),
    showMapLayer: action('showMapLayer', (layer, bool) => {
      if (bool) {
        store.map.addActiveOverlay(layer)
      } else {
        store.map.removeActiveOverlay(layer)
      }
    }),
    showMapApfloraLayer: action('showMapApfloraLayer', (layer, bool) => {
      if (bool) {
        store.map.addActiveApfloraLayer(layer)
      } else {
        store.map.removeActiveApfloraLayer(layer)
      }
    }),
    setIdOfTpopBeingLocalized: action('setIdOfTpopBeingLocalized', id => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      store.map.tpop.idOfTpopBeingLocalized = id
    }),
    localizeTpop: action('localizeTpop', (tree, x, y) => {
      if (store.user.readOnly) return store.tellUserReadOnly()
      localizeTpop(store, tree, x, y)
    }),
    setMapMouseCoord: action('setMapMouseCoord', e => {
      store.map.mouseCoord = [e.latlng.lng, e.latlng.lat]
    }),
    toggleMapPopLabelContent: action(
      'toggleMapPopLabelContent',
      layer => (store.map[layer].labelUsingNr = !store.map[layer].labelUsingNr),
    ),
    mapFilter: {
      filter: {
        features: [],
      },
      pop: computed(
        () => popIdsInsideFeatureCollection(store, store.map.pop.pops),
        { name: 'mapFilterPop' },
      ),
      tpop: computed(
        () => tpopIdsInsideFeatureCollection(store, store.map.tpop.tpops),
        { name: 'mapFilterTpop' },
      ),
      beobNichtBeurteilt: computed(
        () =>
          beobNichtBeurteiltIdsInsideFeatureCollection(
            store,
            store.map.beobNichtBeurteilt.beobs,
          ),
        { name: 'mapFilterBeobNichtBeurteilt' },
      ),
      beobNichtZuzuordnen: computed(
        () =>
          beobNichtZuzuordnenIdsInsideFeatureCollection(
            store,
            store.map.beobNichtZuzuordnen.beobs,
          ),
        { name: 'mapFilterBeobNichtZuzuordnen' },
      ),
      tpopBeob: computed(
        () =>
          tpopBeobIdsInsideFeatureCollection(store, store.map.tpopBeob.beobs),
        { name: 'mapFilterPTpopBeob' },
      ),
    },
    updateMapFilter: action('updateMapFilter', mapFilterItems => {
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
