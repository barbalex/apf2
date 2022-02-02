// 2022.02.02: no more in use as only features needed
import { types } from 'mobx-state-tree'

import Geojson from './Geojson'

export default types.model('MapFilter', {
  features: types.array(Geojson),
  type: types.string,
})
