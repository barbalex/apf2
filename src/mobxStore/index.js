// @flow
import { types } from 'mobx-state-tree'

import ApfloraLayer from './ApfloraLayer'
import MapFilter from './MapFilter'
import standardApfloraLayers from '../components/Projekte/Karte/apfloraLayers'
import standardOverlays from '../components/Projekte/Karte/overlays'

const myTypes = types
  .model({
    apfloraLayers: types.optional(
      types.array(ApfloraLayer),
      standardApfloraLayers,
    ),
    activeApfloraLayers: types.optional(types.array(types.string), []),
    overlays: types.optional(types.array(ApfloraLayer), standardOverlays),
    activeOverlays: types.optional(types.array(types.string), []),
    activeBaseLayer: types.optional(types.string, 'OsmColor'),
    popLabelUsingNr: types.optional(types.boolean, true),
    tpopLabelUsingNr: types.optional(types.boolean, true),
    idOfTpopBeingLocalized: types.optional(types.maybeNull(types.string), null),
    bounds: types.optional(types.array(types.array(types.number)), [
      [47.159, 8.354],
      [47.696, 8.984],
    ]),
    mapFilter: types.optional(MapFilter, {
      features: [],
      type: 'FeatureCollection',
    }),
  })
  // structure of detailplaene is not controlled
  // so need to define this as volatile
  .volatile(() => ({
    detailplaene: null,
    markierungen: null,
  }))
  .actions(self => ({
    setApfloraLayers(val) {
      self.apfloraLayers = val
    },
    setActiveApfloraLayers(val) {
      self.activeApfloraLayers = val
    },
    setOverlays(val) {
      self.overlays = val
    },
    setActiveOverlays(val) {
      self.activeOverlays = val
    },
    setActiveBaseLayer(val) {
      self.activeBaseLayer = val
    },
    setPopLabelUsingNr(val) {
      self.popLabelUsingNr = val
    },
    setTpopLabelUsingNr(val) {
      self.tpopLabelUsingNr = val
    },
    setIdOfTpopBeingLocalized(val) {
      self.idOfTpopBeingLocalized = val
    },
    setBounds(val) {
      self.bounds = val
    },
    setMapFilter(val) {
      self.mapFilter = val
    },
    setDetailplaene(val) {
      self.detailplaene = val
    },
    setMarkierungen(val) {
      self.markierungen = val
    },
  }))

export default myTypes
