import { types } from 'mobx-state-tree'

// this is a geojson geometry
export default types.model({
  coordinates: types.array(types.array(types.array(types.number))),
  type: types.string,
})
