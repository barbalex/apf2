import { types, getParent } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import { navigate } from 'gatsby'

import NodeLabelFilter, {
  defaultValue as defaultNodeLabelFilter,
} from './NodeLabelFilter'
import Map, { defaultValue as defaultMap } from './Map'
import initialDataFilterValues from './DataFilter/initialValues'
import DataFilter from './DataFilter/types'
import apIdInUrl from '../../modules/apIdInUrl'
import projIdInUrl from '../../modules/projIdInUrl'
import ekfIdInUrl from '../../modules/ekfIdInUrl'
import apberuebersichtIdInUrl from '../../modules/apberuebersichtIdInUrl'
import apberIdInUrl from '../../modules/apberIdInUrl'
import popIdInUrl from '../../modules/popIdInUrl'
import tpopIdInUrl from '../../modules/tpopIdInUrl'

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
    apFilter: types.optional(types.boolean, true),
    nodeLabelFilter: types.optional(NodeLabelFilter, defaultNodeLabelFilter),
    dataFilter: types.optional(DataFilter, initialDataFilterValues),
    map: types.optional(Map, defaultMap),
    treeWidth: types.optional(types.number, 500),
    datenWidth: types.optional(types.number, 500),
    filterWidth: types.optional(types.number, 500),
  })
  .actions((self) => ({
    setTreeWidth(val) {
      self.treeWidth = val
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
  .views((self) => ({
    get apIdInActiveNodeArray() {
      return apIdInUrl(self.activeNodeArray)
    },
    get projIdInActiveNodeArray() {
      return projIdInUrl(self.activeNodeArray)
    },
    get ekfIdInActiveNodeArray() {
      return ekfIdInUrl(self.activeNodeArray)
    },
    get apberIdInActiveNodeArray() {
      return apberIdInUrl(self.activeNodeArray)
    },
    get apberuebersichtIdInActiveNodeArray() {
      return apberuebersichtIdInUrl(self.activeNodeArray)
    },
    get popIdInActiveNodeArray() {
      return popIdInUrl(self.activeNodeArray)
    },
    get tpopIdInActiveNodeArray() {
      return tpopIdInUrl(self.activeNodeArray)
    },
  }))

export const defaultValue = {
  name: 'tree',
  activeNodeArray: [],
  openNodes: [],
  apFilter: true,
  nodeLabelFilter: defaultNodeLabelFilter,
  map: defaultMap,
}
