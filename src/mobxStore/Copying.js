import { types } from 'mobx-state-tree'

export default types.model('Copying', {
  table: types.optional(types.maybeNull(types.string), null),
  id: types.optional(types.maybeNull(types.string), null),
  label: types.optional(types.maybeNull(types.string), null),
  withNextLevel: types.optional(types.boolean, false),
})

export const defaultValue = {
  table: null,
  id: null,
  label: null,
  withNextLevel: false,
}
