// @flow
import { types } from 'mobx-state-tree'

import ApfloraLayer from './ApfloraLayer'
import standardApfloraLayers from '../components/Projekte/Karte/apfloraLayers'

const myTypes = types
  .model({
    apfloraLayers: types.optional(
      types.array(ApfloraLayer),
      standardApfloraLayers,
    ),
    activeApfloraLayers: types.optional(types.array(ApfloraLayer), []),
  })
  .actions(self => ({
    setApfloraLayers(val) {
      self.apfloraLayers = val
    },
  }))

export default myTypes
