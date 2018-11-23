import { types } from 'mobx-state-tree'

import NodeLabelFilter, {
  defaultValue as defaultNodeLabelFilter,
} from './NodeLabelFilter'

export default types.model('Tree', {
  name: types.optional(types.string, 'tree'),
  activeNodeArray: types.optional(
    types.array(types.union(types.string, types.number)),
    [],
  ),
  openNodes: types.optional(
    types.array(types.array(types.union(types.string, types.number))),
    [],
  ),
  apFilter: types.optional(types.boolean, false),
  nodeLabelFilter: types.optional(NodeLabelFilter, defaultNodeLabelFilter),
})

export const defaultValue = {
  name: 'tree',
  activeNodeArray: [],
  openNodes: [],
  apFilter: false,
  nodeLabelFilter: defaultNodeLabelFilter,
}
