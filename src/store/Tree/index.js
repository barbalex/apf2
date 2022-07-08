import { types, getParent, getSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import { navigate } from 'gatsby'
import nestedObjectAssign from 'nested-object-assign'

import NodeLabelFilter, {
  defaultValue as defaultNodeLabelFilter,
} from './NodeLabelFilter'
import Map, { defaultValue as defaultMap } from './Map'
import Geojson from './Geojson'
import initialDataFilterValues from './DataFilter/initialValues'
import DataFilter from './DataFilter/types'
import simpleTypes from './DataFilter/simpleTypes'
import { simpleTypes as popType } from './DataFilter/pop'
import {
  simpleTypes as tpopType,
  initial as initialTpop,
} from './DataFilter/tpop'
import { simpleTypes as apType } from './DataFilter/ap'
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
    mapFilter: types.maybe(Geojson),
    // mapFilter: types.optional(
    //   types.union(Geojson, types.literal(undefined)),
    //   undefined,
    // ),
    treeWidth: types.optional(types.number, 500),
    formWidth: types.optional(types.number, 500),
    formHeight: types.optional(types.number, 500),
    filterWidth: types.optional(types.number, 500),
  })
  .actions((self) => ({
    setMapFilter(val) {
      self.mapFilter = val
    },
    emptyMapFilter() {
      self.setMapFilter(undefined)
    },
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
      const store = getParent(self)
      // 1. prepare hiearchy filter
      // need to slice proxy to rerender on change
      const aNA = self.activeNodeArray.slice()
      const projId = aNA[1]
      const singleFilterByHierarchy = { projId: { equalTo: projId } }
      // 2. prepare data filter
      let filterArrayInStore = self.dataFilter.ap
        ? [...getSnapshot(self.dataFilter.ap)]
        : []
      if (filterArrayInStore.length > 1) {
        // check if last is empty
        // empty last is just temporary because user created new "oder" and has not yet input criteria
        // remove it or filter result will be wrong (show all) if criteria.length > 1!
        const last = filterArrayInStore[filterArrayInStore.length - 1]
        const lastIsEmpty =
          Object.values(last).filter((v) => v !== null).length === 0
        if (lastIsEmpty) {
          // popping did not work
          filterArrayInStore = filterArrayInStore.slice(0, -1)
        }
      } else if (filterArrayInStore.length === 0) {
        // Add empty filter if no criteria exist yet
        // Goal: enable adding filters for hierarchy, label and geometry
        // If no filters were added: this empty element will be removed after loopin
        filterArrayInStore.push(initialTpop)
      }
      let setApFilter = false
      if (self.apFilter) {
        setApFilter = true
        const conflictingFilterExists = filterArrayInStore.some((filter) => {
          const apFilterKeys = Object.entries(filter)
            .filter((e) => e[1] !== null)
            .map(([key]) => key)
          return apFilterKeys.some((val) =>
            ['bearbeitung', 'apId'].includes(val),
          )
        })
        if (conflictingFilterExists) {
          setApFilter = false
          self.setApFilter(false)
          console.log(
            'Der "nur AP"-Filter wurde ausgeschaltet. Er verträgt sich nicht mit dem Formular-Filter',
          )
          // need timeout or notification will not appear
          setTimeout(() =>
            store.enqueNotification({
              message:
                'Der "nur AP"-Filter wurde ausgeschaltet. Er verträgt sich nicht mit dem Formular-Filter',
              options: {
                variant: 'info',
              },
            }),
          )
        }
      }
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
        const singleFilter = { ...singleFilterByHierarchy }
        // add apFilter
        if (setApFilter) {
          // add apFilter if no conflicting values are set
          singleFilter.bearbeitung = { in: [1, 2, 3] }
        }
        // add data filter
        const dataFilterAp = { ...filter }
        const apFilterValues = Object.entries(dataFilterAp).filter(
          (e) => e[1] || e[1] === 0,
        )
        apFilterValues.forEach(([key, value]) => {
          const expression = apType[key] === 'string' ? 'includes' : 'equalTo'
          singleFilter[key] = { [expression]: value }
        })
        // add node label filter
        if (self.nodeLabelFilter.ap) {
          singleFilter.label = {
            includesInsensitive: self.nodeLabelFilter.ap,
          }
        }
        // Object could be empty if no filters exist
        // Do not add empty objects
        if (
          Object.values(singleFilter).filter((v) => v !== null).length === 0
        ) {
          break
        }
        filterArray.push(singleFilter)
      }

      // extra check
      const filterArrayWithoutEmptyObjects = filterArray.filter(
        (el) => Object.keys(el).length > 0,
      )

      return {
        all: Object.keys(singleFilterByHierarchy).length
          ? singleFilterByHierarchy
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }
    },
    get artIsFiltered() {
      const firstFilterObject = {
        ...(self.apGqlFilter?.filtered.or?.[0] ?? {}),
      }
      let entries = Object.entries(firstFilterObject).filter(
        (e) => e[0] !== 'projId',
      )
      // if apFilter is set: ignore that value
      if (self.apFilter) {
        entries = entries.filter(
          (e) => !(e[0] === 'bearbeitung' && isEqual(e[1], { in: [1, 2, 3] })),
        )
      }
      return entries.length > 0
    },
    get popGqlFilter() {
      // 1. prepare hiearchy filter
      // need to slice proxy to rerender on change
      const aNA = self.activeNodeArray.slice()
      const projId = aNA[1]
      const apId = aNA[3]
      const popId = aNA[5]
      const popHierarchyFilter = popId ? { id: { equalTo: popId } } : {}
      const apHiearchyFilter = apId ? { apId: { equalTo: apId } } : {}
      const projHiearchyFilter = projId
        ? { apByApId: { projId: { equalTo: projId } } }
        : {}
      const singleFilterByHierarchy = nestedObjectAssign(
        {},
        popHierarchyFilter,
        apHiearchyFilter,
        projHiearchyFilter,
      )
      const singleFilterByParentFiltersForAll = {
        apByApId: self.apGqlFilter.all,
      }
      const singleFilterForAll = nestedObjectAssign(
        singleFilterByHierarchy,
        singleFilterByParentFiltersForAll,
      )
      const singleFilterByParentFiltersForFiltered = {
        apByApId: self.apGqlFilter.filtered,
      }
      // 2. prepare data filter
      let filterArrayInStore = self.dataFilter.pop
        ? [...getSnapshot(self.dataFilter.pop)]
        : []
      if (filterArrayInStore.length > 1) {
        // check if last is empty
        // empty last is just temporary because user created new "oder" and has not yet input criteria
        // remove it or filter result will be wrong (show all) if criteria.length > 1!
        const last = filterArrayInStore[filterArrayInStore.length - 1]
        const lastIsEmpty =
          Object.values(last).filter((v) => v !== null).length === 0
        if (lastIsEmpty) {
          // popping did not work
          filterArrayInStore = filterArrayInStore.slice(0, -1)
        }
      } else if (filterArrayInStore.length === 0) {
        // Add empty filter if no criteria exist yet
        // Goal: enable adding filters for hierarchy, label and geometry
        // If no filters were added: this empty element will be removed after loopin
        filterArrayInStore.push(initialTpop)
      }
      // 3. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
        // const singleFilter = { ...singleFilterByHierarchy }
        const singleFilter = nestedObjectAssign(
          {},
          singleFilterByHierarchy,
          singleFilterByParentFiltersForFiltered,
        )
        // add data filter
        const dataFilterPop = { ...filter }
        const popFilterValues = Object.entries(dataFilterPop).filter(
          (e) => e[1] || e[1] === 0,
        )
        popFilterValues.forEach(([key, value]) => {
          const expression = popType[key] === 'string' ? 'includes' : 'equalTo'
          singleFilter[key] = { [expression]: value }
        })
        // add node label filter
        if (self.nodeLabelFilter.pop) {
          singleFilter.label = {
            includesInsensitive: self.nodeLabelFilter.pop,
          }
        }
        // add mapFilter
        if (self.mapFilter) {
          singleFilter.geomPoint = {
            coveredBy: self.mapFilter,
          }
        }
        // Object could be empty if no filters exist
        // Do not add empty objects
        if (
          Object.values(singleFilter).filter((v) => v !== null).length === 0
        ) {
          break
        }
        filterArray.push(singleFilter)
      }

      // extra check to ensure no empty objects exist
      const filterArrayWithoutEmptyObjects = filterArray.filter(
        (el) => Object.keys(el).length > 0,
      )

      return {
        all: Object.keys(singleFilterForAll).length
          ? singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }
    },
    get popIsFiltered() {
      const firstFilterObject = {
        ...(self.popGqlFilter?.filtered.or?.[0] ?? {}),
      }
      let entries = Object.entries(firstFilterObject).filter(
        (e) => !['projId', 'apByApId', 'geomPoint'].includes(e[0]),
      )
      return entries.length > 0
    },
    get tpopGqlFilter() {
      // 1. prepare hiearchy filter
      // need to slice proxy to rerender on change
      const aNA = self.activeNodeArray.slice()
      const projId = aNA[1]
      const apId = aNA[3]
      const popId = aNA[5]
      const popHierarchyFilter = popId ? { popId: { equalTo: popId } } : {}
      const apHiearchyFilter = apId
        ? { popByPopId: { apId: { equalTo: apId } } }
        : {}
      const projHiearchyFilter = projId
        ? { popByPopId: { apByApId: { projId: { equalTo: projId } } } }
        : {}
      let singleFilterByHierarchy = nestedObjectAssign(
        {},
        popHierarchyFilter,
        apHiearchyFilter,
        projHiearchyFilter,
      )
      // 2. prepare data filter
      let filterArrayInStore = self.dataFilter.tpop
        ? [...getSnapshot(self.dataFilter.tpop)]
        : []
      if (filterArrayInStore.length > 1) {
        // check if last is empty
        // empty last is just temporary because user created new "oder" and has not yet input criteria
        // remove it or filter result will be wrong (show all) if criteria.length > 1!
        const last = filterArrayInStore[filterArrayInStore.length - 1]
        const lastIsEmpty =
          Object.values(last).filter((v) => v !== null).length === 0
        if (lastIsEmpty) {
          // popping did not work
          filterArrayInStore = filterArrayInStore.slice(0, -1)
        }
      } else if (filterArrayInStore.length === 0) {
        // Add empty filter if no criteria exist yet
        // Goal: enable adding filters for hierarchy, label and geometry
        // If no filters were added: this empty element will be removed after loopin
        filterArrayInStore.push(initialTpop)
      }
      // 3. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
        const singleFilter = { ...singleFilterByHierarchy }
        // add data filter
        const dataFilterTpop = { ...filter }
        const tpopFilterValues = Object.entries(dataFilterTpop).filter(
          (e) => e[1] || e[1] === 0,
        )
        tpopFilterValues.forEach(([key, value]) => {
          const expression = tpopType[key] === 'string' ? 'includes' : 'equalTo'
          singleFilter[key] = { [expression]: value }
        })
        // add node label filter
        if (self.nodeLabelFilter.tpop) {
          singleFilter.label = {
            includesInsensitive: self.nodeLabelFilter.tpop,
          }
        }
        // add mapFilter
        if (self.mapFilter) {
          singleFilter.geomPoint = {
            coveredBy: self.mapFilter,
          }
        }
        // Object could be empty if no filters exist
        // Do not add empty objects
        if (
          Object.values(singleFilter).filter((v) => v !== null).length === 0
        ) {
          break
        }
        // Object has filter criteria. Add it!
        filterArray.push(singleFilter)
      }

      // extra check to ensure no empty objects exist
      const filterArrayWithoutEmptyObjects = filterArray.filter(
        (el) => Object.keys(el).length > 0,
      )

      return {
        all: Object.keys(singleFilterByHierarchy).length
          ? singleFilterByHierarchy
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }
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
      if (self.mapFilter) {
        result.tpopByTpopId = {
          geomPoint: {
            coveredBy: self.mapFilter,
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
      if (self.mapFilter) {
        k.tpopByTpopId = {
          geomPoint: {
            coveredBy: self.mapFilter,
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
