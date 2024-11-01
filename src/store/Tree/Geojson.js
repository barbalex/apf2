import { types } from 'mobx-state-tree'

// this is a geojson geometry
export const Geojson = types.model({
  coordinates: types.array(types.array(types.array(types.number))),
  type: types.string,
})
