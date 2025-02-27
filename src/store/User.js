import { types } from 'mobx-state-tree'

export const User = types.model('User', {
  name: types.optional(types.string, ''),
  token: types.optional(types.maybeNull(types.string), null),
  id: types.optional(types.maybeNull(types.string), null),
})

export const defaultValue = {
  name: '',
  token: null,
  id: null,
}
