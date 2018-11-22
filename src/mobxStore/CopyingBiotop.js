import { types } from 'mobx-state-tree'

export default types.model('CopyingBiotop', {
  id: types.optional(types.maybeNull(types.string), null),
  label: types.optional(types.maybeNull(types.string), null),
})

export const defaultValue = {
  id: null,
  label: null,
}
