import { types, getParent } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'

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
    addOpenNodes(nodes) {
      // need set to ensure contained arrays are unique
      const set = new Set([...self.openNodes, ...nodes].map(JSON.stringify))
      self.openNodes = Array.from(set).map(JSON.parse)
    },
    setOpenNodes(val){
      self.openNodes = val
    },
    setApFilter(val) {
      self.apFilter = val
    },
    setActiveNodeArray(val) {
      if (self.name === 'tree') {
        const store = getParent(self)
        const {urlQuery, historyPush} = store
        const search = queryString.stringify(urlQuery)
        const query = `${Object.keys(urlQuery).length > 0 ? `?${search}` : ''}`
        // pass openNodes as state
        // pushing state will set activeNodeArray via modules/historyListen
        historyPush(`/${val.join('/')}${query}`, {
          openNodes: self.openNodes,
        })
      } else {
        self.activeNodeArray = val
      }
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
