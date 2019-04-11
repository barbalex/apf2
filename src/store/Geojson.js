import { types } from 'mobx-state-tree'

export default types.model('Geojson', {
  type: types.string,
  geometry: types.model('GeoJsonGeometry', {
    coordinates: types.array(types.array(types.array(types.number))),
    type: types.string,
  }),
  properties: types.model('GeoJsonProperties', {}),
})
