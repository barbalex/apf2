import { types } from 'mobx-state-tree'

export default types.model('MapMouseCoordinates', {
  x: types.optional(types.maybeNull(types.number), 2683000),
  y: types.optional(types.maybeNull(types.number), 1247500),
})

export const defaultValue = {
  x: 2683000,
  y: 1247500,
}
