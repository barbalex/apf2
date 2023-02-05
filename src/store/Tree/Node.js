// no more used?
import { types } from 'mobx-state-tree'

export default types.model('Node', {
  nodeType: types.optional(types.string, ''),
  menuType: types.optional(types.string, ''),
  id: types.optional(types.union(types.string, types.number), ''),
  parentId: types.optional(types.union(types.string, types.number), ''),
  urlLabel: types.optional(types.union(types.string, types.number), ''),
  label: types.optional(types.union(types.string, types.number), ''),
  url: types.array(types.union(types.string, types.number)),
  hasChildren: types.optional(types.boolean, false),
})

export const defaultValue = {
  nodeType: '',
  menuType: '',
  id: '',
  parentId: '',
  urlLabel: '',
  label: '',
  url: [],
  hasChildren: false,
}
