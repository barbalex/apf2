import { types, getParent, getSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import { navigate } from 'gatsby'

import NodeLabelFilter, {
  defaultValue as defaultNodeLabelFilter,
} from './NodeLabelFilter'
import Map, { defaultValue as defaultMap } from './Map'
import initialDataFilterValues from './DataFilter/initialValues'
import DataFilter from './DataFilter/types'
import simpleTypes from './DataFilter/simpleTypes'
import { simpleTypes as popType, initial as initialPop } from './DataFilter/pop'
import {
  simpleTypes as tpopType,
  initial as initialTpop,
} from './DataFilter/tpop'
import { simpleTypes as apType, initial as initialAp } from './DataFilter/ap'
import apIdInUrl from '../../modules/apIdInUrl'
import projIdInUrl from '../../modules/projIdInUrl'
import ekfIdInUrl from '../../modules/ekfIdInUrl'
import apberuebersichtIdInUrl from '../../modules/apberuebersichtIdInUrl'
import apberIdInUrl from '../../modules/apberIdInUrl'
import popIdInUrl from '../../modules/popIdInUrl'
import tpopIdInUrl from '../../modules/tpopIdInUrl'
import exists from '../../modules/exists'

export default types
  .model('Tree', {
    name: types.optional(types.string, 'tree'),
    activeNodeArray: types.array(types.union(types.string, types.number)),
    // lastTouchedNode is needed to keep the last clicked arrow known
    // so it does not jump
    // before using this, activeNodeArray was used instead
    // but then when an arrow out of sight of the active node
    // is clicked, the list jumps back to the active node :-(
    lastTouchedNode: types.optional(
      types.array(types.union(types.string, types.number)),
      [],
    ),
    openNodes: types.array(
      types.array(types.union(types.string, types.number)),
    ),
    apFilter: types.optional(types.boolean, true),
    nodeLabelFilter: types.optional(NodeLabelFilter, defaultNodeLabelFilter),
    dataFilter: types.optional(DataFilter, initialDataFilterValues),
    map: types.optional(Map, defaultMap),
    treeWidth: types.optional(types.number, 500),
    formWidth: types.optional(types.number, 500),
    formHeight: types.optional(types.number, 500),
    filterWidth: types.optional(types.number, 500),
  })
  .actions((self) => ({
    setLastTouchedNode(val) {
      self.lastTouchedNode = val
    },
    setTreeWidth(val) {
      self.treeWidth = val
    },
    setFormWidth(val) {
      self.formWidth = val
    },
    setFormHeight(val) {
      self.formHeight = val
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
    setActiveNodeArray(val, nonavigate) {
      if (isEqual(val, self.activeNodeArray)) {
        // do not do this if already set
        // trying to stop vicious cycle of reloading in first start after update
        return
      }
      if (self.name === 'tree' && !nonavigate) {
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
    get apGqlFilter() {
      const projId = self.activeNodeArray[1]
      const filterArrayInStore = self.dataFilter.ap
        ? getSnapshot(self.dataFilter.ap)
        : []
      // need to remove empty filters - they exist when user clicks "oder" but has not entered a value yet
      const filterArrayInStoreWithoutEmpty = filterArrayInStore.filter(
        (f) => Object.values(f).filter((v) => v !== null).length !== 0,
      )
      if (filterArrayInStoreWithoutEmpty.length === 0) {
        // add empty filter
        filterArrayInStoreWithoutEmpty.push(initialAp)
      }
      const filterArray = []
      for (const filter of filterArrayInStoreWithoutEmpty) {
        const apFilter = { projId: { equalTo: projId } }
        const dataFilterAp = { ...filter }
        const apFilterValues = Object.entries(dataFilterAp).filter(
          (e) => e[1] || e[1] === 0,
        )
        apFilterValues.forEach(([key, value]) => {
          const expression = apType[key] === 'string' ? 'includes' : 'equalTo'
          apFilter[key] = { [expression]: value }
        })
        if (self.nodeLabelFilter.ap) {
          apFilter.label = {
            includesInsensitive: self.nodeLabelFilter.ap,
          }
        }
        filterArray.push(apFilter)
      }
      return { or: filterArray }
    },
    get popGqlFilter() {
      // need to slice to rerender on change
      const apId = self.activeNodeArray.slice()[3]
      const filterArrayInStore = self.dataFilter.pop
        ? getSnapshot(self.dataFilter.pop)
        : []
      // need to remove empty filters - they exist when user clicks "oder" but has not entered a value yet
      const filterArrayInStoreWithoutEmpty = filterArrayInStore.filter(
        (f) => Object.values(f).filter((v) => v !== null).length !== 0,
      )
      if (filterArrayInStoreWithoutEmpty.length === 0) {
        // add empty filter
        filterArrayInStoreWithoutEmpty.push(initialPop)
      }
      const filterArray = []
      for (const filter of filterArrayInStoreWithoutEmpty) {
        const popFilter = apId ? { apId: { equalTo: apId } } : {}
        const dataFilterPop = { ...filter }
        const popFilterValues = Object.entries(dataFilterPop).filter(
          (e) => e[1] || e[1] === 0,
        )
        popFilterValues.forEach(([key, value]) => {
          const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
          popFilter[key] = { [expression]: value }
        })
        if (self.nodeLabelFilter.pop) {
          popFilter.label = {
            includesInsensitive: self.nodeLabelFilter.pop,
          }
        }
        // do not add empty object
        if (Object.keys(popFilter).length === 0) break
        filterArray.push(popFilter)
      }
      // need to filter by apId
      if (filterArray.length === 0 && apId) {
        filterArray.push({ apId: { equalTo: apId } })
      }
      return { or: filterArray }
    },
    get tpopGqlFilter() {
      // need to slice to rerender on change
      const projId = self.activeNodeArray.slice()[1]
      const apId = self.activeNodeArray.slice()[3]
      const popId = self.activeNodeArray.slice()[5]
      const filterArrayInStore = self.dataFilter.tpop
        ? getSnapshot(self.dataFilter.tpop)
        : []
      // need to remove empty filters - they exist when user clicks "oder" but has not entered a value yet
      const filterArrayInStoreWithoutEmpty = filterArrayInStore.filter(
        (f) => Object.values(f).filter((v) => v !== null).length !== 0,
      )
      if (filterArrayInStoreWithoutEmpty.length === 0) {
        // add empty filter
        filterArrayInStoreWithoutEmpty.push(initialTpop)
      }
      const filterArray = []
      // TODO: add singleFilterByUrl to popGqlFilter
      const singleFilterByUrl = popId ? { popId: { equalTo: popId } } : {}
      if (apId) {
        singleFilterByUrl.popByPopId = { apId: { equalTo: apId } }
      }
      if (projId) {
        if (!singleFilterByUrl.popByPopId) singleFilterByUrl.popByPopId = {}
        singleFilterByUrl.popByPopId.apByApId = { projId: { equalTo: projId } }
      }
      for (const filter of filterArrayInStoreWithoutEmpty) {
        // add parents according to url
        const singleFilter = { ...singleFilterByUrl }
        // add filter criteria from data filter
        const dataFilterTpop = { ...filter }
        const tpopFilterValues = Object.entries(dataFilterTpop).filter(
          (e) => e[1] || e[1] === 0,
        )
        tpopFilterValues.forEach(([key, value]) => {
          const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
          singleFilter[key] = { [expression]: value }
        })
        // add tree node label filter
        if (self.nodeLabelFilter.tpop) {
          singleFilter.label = {
            includesInsensitive: self.nodeLabelFilter.tpop,
          }
        }
        // if mapFilter is set, add it too
        // TODO: add mapFilter to popGqlFilter
        if (self.mapFilter?.[0]?.geometry && self.exportApplyMapFilter) {
          singleFilter.geomPoint = {
            coveredBy: self.mapFilter[0].geometry,
          }
        }
        // do not add empty object
        if (Object.keys(singleFilter).length === 0) break
        filterArray.push(singleFilter)
      }
      // need to filter by url, if exists
      if (filterArray.length === 0 && Object.keys(singleFilterByUrl).length) {
        filterArray.push(singleFilterByUrl)
      }
      return { or: filterArray }
    },
    get tpopmassnGqlFilter() {
      const result = Object.fromEntries(
        Object.entries(getSnapshot(self.dataFilter.tpopmassn))
          // eslint-disable-next-line no-unused-vars
          .filter(([key, value]) => exists(value))
          .map(([key, value]) => {
            // if is string: includes, else: equalTo
            const type = simpleTypes.tpopmassn[key]
            if (type === 'string') {
              return [key, { includes: value }]
            }
            return [key, { equalTo: value }]
          }),
      )
      // if mapFilter is set, filter by its geometry
      if (self.mapFilter?.[0]?.geometry && self.exportApplyMapFilter) {
        result.tpopByTpopId = {
          geomPoint: {
            coveredBy: self.mapFilter[0].geometry,
          },
        }
      }
      // return a valid filter even if no filter criterias exist
      // but ensure it returns all rows
      if (Object.entries(result).length === 0) return { id: { isNull: false } }
      return result
    },
    get tpopkontrGqlFilter() {
      const ek = Object.fromEntries(
        Object.entries(getSnapshot(self.dataFilter.tpopfeldkontr))
          // eslint-disable-next-line no-unused-vars
          .filter(([key, value]) => exists(value))
          .map(([key, value]) => {
            // if is string: includes, else: equalTo
            const type = simpleTypes.tpopfeldkontr[key]
            if (type === 'string') {
              return [key, { includes: value }]
            }
            return [key, { equalTo: value }]
          }),
      )
      const ekf = Object.fromEntries(
        Object.entries(getSnapshot(self.dataFilter.tpopfreiwkontr))
          // eslint-disable-next-line no-unused-vars
          .filter(([key, value]) => exists(value))
          .map(([key, value]) => {
            // if is string: includes, else: equalTo
            const type = simpleTypes.tpopfreiwkontr[key]
            if (type === 'string') {
              return [key, { includes: value }]
            }
            return [key, { equalTo: value }]
          }),
      )
      const k = { ...ekf, ...ek }
      // if mapFilter is set, filter by its geometry
      if (self.mapFilter?.[0]?.geometry && self.exportApplyMapFilter) {
        k.tpopByTpopId = {
          geomPoint: {
            coveredBy: self.mapFilter[0].geometry,
          },
        }
      }
      // return a valid filter even if no filter criterias exist
      // but ensure it returns all rows
      if (Object.entries(k).length === 0) return { id: { isNull: false } }
      return k
    },
  }))

export const defaultValue = {
  name: 'tree',
  activeNodeArray: [],
  lastTouchedNode: [],
  openNodes: [],
  apFilter: true,
  nodeLabelFilter: defaultNodeLabelFilter,
  map: defaultMap,
}
