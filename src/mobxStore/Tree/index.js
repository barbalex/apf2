import { types } from 'mobx-state-tree'

import NodeLabelFilter, {
  defaultValue as defaultNodeLabelFilter,
} from './NodeLabelFilter'

export default types.model('Tree', {
  name: types.optional(types.string, 'tree'),
  activeNodeArray: types.optional(types.array(types.string), []),
  openNodes: types.optional(types.array(types.array(types.string)), []),
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
