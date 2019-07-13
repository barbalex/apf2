import { types } from 'mobx-state-tree'

export default types
  .model('Hovered', {
    year: types.optional(types.maybeNull(types.number), null),
    tpopId: types.optional(types.maybeNull(types.string), null),
  })
  .actions(self => ({
    set(val) {
      self.year = val.year
      self.tpopId = val.tpopId
    },
    setYear(val) {
      self.year = val
    },
    setTpopId(val) {
      self.tpopId = val
    },
    reset() {
      self.year = null
      self.tpopId = null
    },
  }))

export const defaultValue = {
  year: null,
  tpopId: null,
}
