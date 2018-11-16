// @flow
import { types } from 'mobx-state-tree'

import ApfloraLayer from './ApfloraLayer'
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
  })
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
  }))

export default myTypes
