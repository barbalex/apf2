import { types } from 'mobx-state-tree'

export const Moving = types.model('Moving', {
  table: types.optional(types.maybeNull(types.string), null),
  id: types.optional(types.maybeNull(types.string), null),
  label: types.optional(types.maybeNull(types.string), null),
  moveToTable: types.optional(types.maybeNull(types.string), null),
  moveFromId: types.optional(types.maybeNull(types.string), null),
})

export const defaultValue = {
  table: null,
  id: null,
  label: null,
  moveToTable: null,
  moveFromId: null,
}
