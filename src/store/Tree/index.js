import { types, getParent } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import { navigate } from 'gatsby'

import NodeLabelFilter, {
  defaultValue as defaultNodeLabelFilter,
} from './NodeLabelFilter'
import Map, { defaultValue as defaultMap } from './Map'

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
    setOpenNodes(val) {
      // need set to ensure contained arrays are unique
      const set = new Set(val.map(JSON.stringify))
      self.openNodes = Array.from(set).map(JSON.parse)
    },
    addOpenNodes(nodes) {
      // need set to ensure contained arrays are unique
      const set = new Set([...self.openNodes, ...nodes].map(JSON.stringify))
      self.openNodes = Array.from(set).map(JSON.parse)
    },
    setApFilter(val) {
      self.apFilter = val
    },
    setActiveNodeArray(val) {
      if (isEqual(val, self.activeNodeArray)) {
        // do not do this if already set
        // trying to stop vicious cycle of reloading in first start after update
        return
      }
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

export const defaultValue = {
  name: 'tree',
  activeNodeArray: [],
  openNodes: [],
  apFilter: false,
  nodeLabelFilter: defaultNodeLabelFilter,
  map: defaultMap,
}
