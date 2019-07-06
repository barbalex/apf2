import { types } from 'mobx-state-tree'

export default types.model('Ap', {
  value: types.optional(types.string, ''),
  label: types.optional(types.union(types.string, types.number), ''),
})

export const defaultValue = {
  value: '',
  label: '',
}
