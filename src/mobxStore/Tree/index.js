import { types } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'

import NodeLabelFilter, {
  defaultValue as defaultNodeLabelFilter,
} from './NodeLabelFilter'
import Map, { defaultValue as defaultMap } from './Map'
import Node from './Node'

export default types
  .model('Tree', {
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
    map: types.optional(Map, defaultMap),
    nodes: types.optional(types.array(Node), []),
  })
  .actions(self => ({
    setNodes(val) {
      self.nodes = val
    },
    setOpenNodes(val) {
      self.openNodes = val
    },
    addOpenNodes(nodes) {
      // need set to ensure contained arrays are unique
      const set = new Set([...self.openNodes, ...nodes].map(JSON.stringify))
      self.openNodes = Array.from(set).map(JSON.parse)
    },
  }))
  .views(self => ({
    get activeNode() {
      return self.nodes.find(n => isEqual(n.url, self.activeNodeArray))
    },
  }))

export const defaultValue = {
  name: 'tree',
  activeNodeArray: [],
  openNodes: [],
  apFilter: false,
  nodeLabelFilter: defaultNodeLabelFilter,
  map: defaultMap,
  nodes: [],
}
