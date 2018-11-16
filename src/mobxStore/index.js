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
  }))

export default myTypes
