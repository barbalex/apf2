import { types } from 'mobx-state-tree'

import Geojson from './Geojson'

export default types.model('MapFilter', {
  features: types.array(Geojson),
  type: types.string,
})
