import { types } from 'mobx-state-tree'

export default types.model('ApfloraLayer', {
  label: types.string,
  value: types.string,
})
