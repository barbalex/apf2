import { types, getParent } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import queryString from 'query-string'
import { navigate } from 'gatsby'

import NodeLabelFilter, {
  defaultValue as defaultNodeLabelFilter,
} from './NodeLabelFilter'
import Map, { defaultValue as defaultMap } from './Map'
import Node from './Node'
import activeFormFromActiveNodeArray from '../../modules/activeFormFromActiveNodeArray'

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
    treeWidth: types.optional(types.number, 500),
    treeHeight: types.optional(types.number, 800),
    datenWidth: types.optional(types.number, 500),
    filterWidth: types.optional(types.number, 500),
  })
  .actions(self => ({
    setTreeWidth(val) {
      self.treeWidth = val
    },
    setTreeHeight(val) {
      self.treeHeight = val
    },
    setDatenWidth(val) {
      self.datenWidth = val
    },
    setFilterWidth(val) {
      self.filterWidth = val
    },
    setNodes(val) {
      self.nodes = val
    },
    addOpenNodes(nodes) {
      // need set to ensure contained arrays are unique
      const set = new Set([...self.openNodes, ...nodes].map(JSON.stringify))
      self.openNodes = Array.from(set).map(JSON.parse)
    },
    setOpenNodes(val) {
      // need set to ensure contained arrays are unique
      const set = new Set(val.map(JSON.stringify))
      self.openNodes = Array.from(set).map(JSON.parse)
    },
    setApFilter(val) {
      self.apFilter = val
    },
    setActiveNodeArray(val) {
      if (self.name === 'tree') {
        const store = getParent(self)
        const { urlQuery } = store
        const search = queryString.stringify(urlQuery)
        const query = `${Object.keys(urlQuery).length > 0 ? `?${search}` : ''}`
        navigate(`/Daten/${val.join('/')}${query}`)
      }
      self.activeNodeArray = val
    },
  }))
  .views(self => ({
    get activeNode() {
      return self.nodes.find(n => isEqual(n.url, self.activeNodeArray))
    },
    get activeForm() {
      const store = getParent(self)
      return activeFormFromActiveNodeArray({
        url: self.activeNodeArray,
        // Do not know if directly accessing activeNode is a problem here
        // because may cause extra renders or be late
        // so re-calculate
        activeNode: self.nodes.find(n => isEqual(n.url, self.activeNodeArray)),
        activeFilterTable: get(
          store,
          `nodeFilter.${self.name}.activeTable`,
          '',
        ),
      })
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
