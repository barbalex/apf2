import { types } from 'mobx-state-tree'

import Geojson from './Geojson'

export default types.model('MapFilter', {
  features: types.optional(types.array(Geojson), []),
  type: types.string,
})
