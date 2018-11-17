import { types } from 'mobx-state-tree'

export default types.model('Geojson', {
  type: types.string,
  coordinates: types.array(types.array(types.number)),
})
