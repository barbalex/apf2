import { types } from 'mobx-state-tree'

export const Moving = types.model('Moving', {
  table: types.optional(types.maybeNull(types.string), null),
  id: types.optional(types.maybeNull(types.string), null),
  label: types.optional(types.maybeNull(types.string), null),
  toTable: types.optional(types.maybeNull(types.string), null),
  fromParentId: types.optional(types.maybeNull(types.string), null),
})

export const defaultValue = {
  table: null,
  id: null,
  label: null,
  toTable: null,
  fromParentId: null,
}
