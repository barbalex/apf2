import { types } from 'mobx-state-tree'

export const ApfloraLayer = types.model('ApfloraLayer', {
  label: types.string,
  value: types.string,
})
