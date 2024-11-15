import { types } from 'mobx-state-tree'

export const Copying = types.model('Copying', {
  table: types.optional(types.maybeNull(types.string), null),
  biotop: types.optional(types.boolean, false),
  id: types.optional(types.maybeNull(types.string), null),
  label: types.optional(types.maybeNull(types.string), null),
  withNextLevel: types.optional(types.boolean, false),
})

export const defaultValue = {
  table: null,
  biotop: false,
  id: null,
  label: null,
  withNextLevel: false,
}
