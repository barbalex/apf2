import { types, getParent, getSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import { navigate } from 'gatsby'
import nestedObjectAssign from 'nested-object-assign'
import isUuid from 'is-uuid'

import NodeLabelFilter, {
  defaultValue as defaultNodeLabelFilter,
} from './NodeLabelFilter'
import Map, { defaultValue as defaultMap } from './Map'
import Geojson from './Geojson'
import initialDataFilterValues from './DataFilter/initialValues'
import DataFilter from './DataFilter/types'
import { simpleTypes as popType } from './DataFilter/pop'
import {
  simpleTypes as tpopType,
  initial as initialTpop,
} from './DataFilter/tpop'
import {
  simpleTypes as tpopmassnType,
  initial as initialTpopmassn,
} from './DataFilter/tpopmassn'
import {
  simpleTypes as tpopfeldkontrType,
  initial as initialTpopfeldkontr,
} from './DataFilter/tpopfeldkontr'
import {
  simpleTypes as tpopfreiwkontrType,
  initial as initialTpopfreiwkontr,
} from './DataFilter/tpopfreiwkontr'
import { simpleTypes as apType } from './DataFilter/ap'

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
      if (
        self.activeNodeArray.length > 3 &&
        self.activeNodeArray[2] === 'Arten'
      ) {
        const id = self.activeNodeArray[3]
        if (isUuid.anyNonNil(id)) return id
      }
      return undefined
    },
    get projIdInActiveNodeArray() {
      if (self.activeNodeArray.includes('Projekte')) {
        const indexOfId = self.activeNodeArray.indexOf('Projekte') + 1
        if (self.activeNodeArray.length > indexOfId) {
          const id = self.activeNodeArray?.[indexOfId]
          if (isUuid.anyNonNil(id)) return id
        }
      }
      return undefined
    },
    get ekfIdInActiveNodeArray() {
      if (self.activeNodeArray.includes('Freiwilligen-Kontrollen')) {
        const indexOfId =
          self.activeNodeArray.indexOf('Freiwilligen-Kontrollen') + 1
        if (self.activeNodeArray.length > indexOfId) {
          const id = self.activeNodeArray?.[indexOfId]
          if (isUuid.anyNonNil(id)) return id
        }
      }
      return undefined
    },
    get apberIdInActiveNodeArray() {
      if (self.activeNodeArray[4] === 'AP-Berichte') {
        const indexOfId = self.activeNodeArray.indexOf('AP-Berichte') + 1
        if (self.activeNodeArray.length > indexOfId) {
          const id = self.activeNodeArray?.[indexOfId]
          if (isUuid.anyNonNil(id)) return id
        }
      }
      return undefined
    },
    get apberuebersichtIdInActiveNodeArray() {
      if (self.activeNodeArray[2] === 'AP-Berichte') {
        const indexOfId = self.activeNodeArray.indexOf('AP-Berichte') + 1
        if (self.activeNodeArray.length > indexOfId) {
          const id = self.activeNodeArray?.[indexOfId]
          if (isUuid.anyNonNil(id)) return id
        }
      }
      return undefined
    },
    get popIdInActiveNodeArray() {
      if (
        self.activeNodeArray.length > 5 &&
        self.activeNodeArray[4] === 'Populationen'
      ) {
        const id = self.activeNodeArray[5]
        if (isUuid.anyNonNil(id)) return id
      }
      return undefined
    },
    get tpopIdInActiveNodeArray() {
      if (self.activeNodeArray.includes('Teil-Populationen')) {
        const indexOfId = self.activeNodeArray.indexOf('Teil-Populationen') + 1
        if (self.activeNodeArray.length > indexOfId) {
          const id = self.activeNodeArray?.[indexOfId]
          if (isUuid.anyNonNil(id)) return id
        }
      }
      return undefined
    },
    get apGqlFilter() {
      const store = getParent(self)
      // 1. prepare hiearchy filter
      const projId = self.projIdInActiveNodeArray
      const singleFilterByHierarchy = projId
        ? { projId: { equalTo: projId } }
        : {}
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
          (e) => e[1] !== null,
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

      const apGqlFilter = {
        all: Object.keys(singleFilterByHierarchy).length
          ? singleFilterByHierarchy
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('apGqlFilter:', apGqlFilter)

      return apGqlFilter
    },
    get artIsFiltered() {
      const firstFilterObject = {
        ...(self.apGqlFilter?.filtered?.or?.[0] ?? {}),
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
      const projId = self.projIdInActiveNodeArray
      const apId = self.apIdInActiveNodeArray
      const apHiearchyFilter = apId ? { apId: { equalTo: apId } } : {}
      const projHiearchyFilter = projId
        ? { apByApId: { projId: { equalTo: projId } } }
        : {}
      const singleFilterByHierarchy = nestedObjectAssign(
        {},
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
        const singleFilter = nestedObjectAssign(
          {},
          singleFilterByHierarchy,
          singleFilterByParentFiltersForFiltered,
        )
        // add data filter
        const dataFilterPop = { ...filter }
        const popFilterValues = Object.entries(dataFilterPop).filter(
          (e) => e[1] !== null,
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

      const popGqlFilter = {
        all: Object.keys(singleFilterForAll).length
          ? singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('popGqlFilter:', popGqlFilter)

      return popGqlFilter
    },
    get popIsFiltered() {
      const firstFilterObject = {
        ...(self.popGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      let entries = Object.entries(firstFilterObject).filter(
        (e) => !['projId', 'apId', 'apByApId', 'geomPoint'].includes(e[0]),
      )
      return entries.length > 0
    },
    get tpopGqlFilter() {
      // 1. prepare hiearchy filter
      const projId = self.projIdInActiveNodeArray
      const apId = self.apIdInActiveNodeArray
      // Der Hierarchie-Filter auf Ebene Population und Teil-Population hat sich nicht bewährt und wurde nach kurzer Zeit wieder entfernt
      // const popId = self.popIdInActiveNodeArray
      // const popHierarchyFilter = popId ? { popId: { equalTo: popId } } : {}
      const apHiearchyFilter = apId
        ? { popByPopId: { apId: { equalTo: apId } } }
        : {}
      const projHiearchyFilter = projId
        ? { popByPopId: { apByApId: { projId: { equalTo: projId } } } }
        : {}
      let singleFilterByHierarchy = nestedObjectAssign(
        {},
        // popHierarchyFilter,
        apHiearchyFilter,
        projHiearchyFilter,
      )
      const singleFilterByParentFiltersForAll = {
        popByPopId: self.popGqlFilter.all,
      }
      const singleFilterForAll = nestedObjectAssign(
        singleFilterByHierarchy,
        singleFilterByParentFiltersForAll,
      )
      const singleFilterByParentFiltersForFiltered = {
        popByPopId: self.popGqlFilter.filtered,
      }
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
        const singleFilter = nestedObjectAssign(
          {},
          singleFilterByHierarchy,
          singleFilterByParentFiltersForFiltered,
        )
        // add data filter
        const dataFilterTpop = { ...filter }
        const tpopFilterValues = Object.entries(dataFilterTpop).filter(
          (e) => e[1] !== null,
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

      const tpopGqlFilter = {
        all: Object.keys(singleFilterForAll).length
          ? singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('tpopGqlFilter:', tpopGqlFilter)

      return tpopGqlFilter
    },
    get tpopIsFiltered() {
      const firstFilterObject = {
        ...(self.tpopGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      let entries = Object.entries(firstFilterObject).filter(
        (e) =>
          !['projId', 'apId', 'popId', 'popByPopId', 'geomPoint'].includes(
            e[0],
          ),
      )
      return entries.length > 0
    },
    get tpopmassnGqlFilter() {
      // 1. prepare hiearchy filter
      const projId = self.projIdInActiveNodeArray
      const apId = self.apIdInActiveNodeArray
      // Der Hierarchie-Filter auf Ebene Population und Teil-Population hat sich nicht bewährt und wurde nach kurzer Zeit wieder entfernt
      // const popId = self.popIdInActiveNodeArray
      // const tpopId = self.tpopIdInActiveNodeArray
      // const tpopHierarchyFilter = tpopId ? { tpopId: { equalTo: tpopId } } : {}
      // const popHierarchyFilter = popId
      //   ? { tpopByTpopId: { popId: { equalTo: popId } } }
      //   : {}
      const apHiearchyFilter = apId
        ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
        : {}
      const projHiearchyFilter = projId
        ? {
            tpopByTpopId: {
              popByPopId: { apByApId: { projId: { equalTo: projId } } },
            },
          }
        : {}
      let singleFilterByHierarchy = nestedObjectAssign(
        {},
        // tpopHierarchyFilter,
        // popHierarchyFilter,
        apHiearchyFilter,
        projHiearchyFilter,
      )
      const singleFilterByParentFiltersForAll = {
        tpopByTpopId: self.tpopGqlFilter.all,
      }
      const singleFilterForAll = nestedObjectAssign(
        singleFilterByHierarchy,
        singleFilterByParentFiltersForAll,
      )
      const singleFilterByParentFiltersForFiltered = {
        tpopByTpopId: self.tpopGqlFilter.filtered,
      }
      // 2. prepare data filter
      let filterArrayInStore = self.dataFilter.tpopmassn
        ? [...getSnapshot(self.dataFilter.tpopmassn)]
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
        filterArrayInStore.push(initialTpopmassn)
      }
      // 3. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
        const singleFilter = nestedObjectAssign(
          {},
          singleFilterByHierarchy,
          singleFilterByParentFiltersForFiltered,
        )
        // add data filter
        const dataFilterTpopmassn = { ...filter }
        const tpopmassnFilterValues = Object.entries(
          dataFilterTpopmassn,
        ).filter((e) => e[1] !== null)
        tpopmassnFilterValues.forEach(([key, value]) => {
          const expression =
            tpopmassnType[key] === 'string' ? 'includes' : 'equalTo'
          singleFilter[key] = { [expression]: value }
        })
        // add node label filter
        if (self.nodeLabelFilter.tpopmassn) {
          singleFilter.label = {
            includesInsensitive: self.nodeLabelFilter.tpopmassn,
          }
        }
        // add mapFilter
        if (self.mapFilter) {
          singleFilter.tpopByTpopId.geomPoint = {
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

      const tpopmassnGqlFilter = {
        all: Object.keys(singleFilterForAll).length
          ? singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('tpopmassnGqlFilter:', tpopmassnGqlFilter)

      return tpopmassnGqlFilter
    },
    get tpopmassnIsFiltered() {
      const firstFilterObject = {
        ...(self.tpopmassnGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      // console.log('tpopmassnIsFiltered, firstFilterObject:', firstFilterObject)
      let entries = Object.entries(firstFilterObject).filter(
        (e) =>
          !['projId', 'apId', 'popId', 'tpopByTpopId', 'geomPoint'].includes(
            e[0],
          ),
      )
      return entries.length > 0
    },
    get ekGqlFilter() {
      // 1. prepare hiearchy filter
      const projId = self.projIdInActiveNodeArray
      const apId = self.apIdInActiveNodeArray
      // Der Hierarchie-Filter auf Ebene Population und Teil-Population hat sich nicht bewährt und wurde nach kurzer Zeit wieder entfernt
      // const popId = self.popIdInActiveNodeArray
      // const tpopId = self.tpopIdInActiveNodeArray
      // const tpopHierarchyFilter = tpopId ? { tpopId: { equalTo: tpopId } } : {}
      // const popHierarchyFilter = popId
      //   ? { tpopByTpopId: { popId: { equalTo: popId } } }
      //   : {}
      const apHiearchyFilter = apId
        ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
        : {}
      const projHiearchyFilter = projId
        ? {
            tpopByTpopId: {
              popByPopId: { apByApId: { projId: { equalTo: projId } } },
            },
          }
        : {}
      let singleFilterByHierarchy = nestedObjectAssign(
        {},
        {
          or: [
            { typ: { isNull: true } },
            { typ: { in: ['Zwischenbeurteilung', 'Ausgangszustand'] } },
          ],
        },
        // tpopHierarchyFilter,
        // popHierarchyFilter,
        apHiearchyFilter,
        projHiearchyFilter,
      )
      const singleFilterByParentFiltersForAll = {
        tpopByTpopId: self.tpopGqlFilter.all,
      }
      const singleFilterForAll = nestedObjectAssign(
        singleFilterByHierarchy,
        singleFilterByParentFiltersForAll,
      )
      const singleFilterByParentFiltersForFiltered = {
        tpopByTpopId: self.tpopGqlFilter.filtered,
      }
      // 2. prepare data filter
      let filterArrayInStore = self.dataFilter.tpopfeldkontr
        ? [...getSnapshot(self.dataFilter.tpopfeldkontr)]
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
        filterArrayInStore.push(initialTpopfeldkontr)
      }
      // 3. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
        const singleFilter = nestedObjectAssign(
          {},
          singleFilterByHierarchy,
          singleFilterByParentFiltersForFiltered,
        )
        // add data filter
        const dataFilter = { ...filter }
        const filterValues = Object.entries(dataFilter).filter(
          (e) => e[1] !== null,
        )
        filterValues.forEach(([key, value]) => {
          const expression =
            tpopfeldkontrType[key] === 'string' ? 'includes' : 'equalTo'
          singleFilter[key] = { [expression]: value }
        })
        // add node label filter
        if (self.nodeLabelFilter.tpopfeldkontr) {
          singleFilter.label = {
            includesInsensitive: self.nodeLabelFilter.tpopfeldkontr,
          }
        }
        // add mapFilter
        if (self.mapFilter) {
          singleFilter.tpopByTpopId.geomPoint = {
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

      const ekGqlFilter = {
        all: Object.keys(singleFilterForAll).length
          ? singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('ekGqlFilter:', ekGqlFilter)

      return ekGqlFilter
    },
    get ekIsFiltered() {
      const firstFilterObject = {
        ...(self.ekGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      let entries = Object.entries(firstFilterObject).filter(
        (e) => !['tpopByTpopId'].includes(e[0]),
      )
      return entries.length > 0
    },
    get ekfGqlFilter() {
      // 1. prepare hiearchy filter
      const projId = self.projIdInActiveNodeArray
      const apId = self.apIdInActiveNodeArray
      // Der Hierarchie-Filter auf Ebene Population und Teil-Population hat sich nicht bewährt und wurde nach kurzer Zeit wieder entfernt
      // const popId = self.popIdInActiveNodeArray
      // const tpopId = self.tpopIdInActiveNodeArray
      // const tpopHierarchyFilter = tpopId ? { tpopId: { equalTo: tpopId } } : {}
      // const popHierarchyFilter = popId
      //   ? { tpopByTpopId: { popId: { equalTo: popId } } }
      //   : {}
      const apHiearchyFilter = apId
        ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
        : {}
      const projHiearchyFilter = projId
        ? {
            tpopByTpopId: {
              popByPopId: { apByApId: { projId: { equalTo: projId } } },
            },
          }
        : {}
      const singleFilterByHierarchy = nestedObjectAssign(
        {},
        { typ: { equalTo: 'Freiwilligen-Erfolgskontrolle' } },
        // tpopHierarchyFilter,
        // popHierarchyFilter,
        apHiearchyFilter,
        projHiearchyFilter,
      )
      const singleFilterByParentFiltersForAll = {
        tpopByTpopId: self.tpopGqlFilter.all,
      }
      const singleFilterForAll = nestedObjectAssign(
        singleFilterByHierarchy,
        singleFilterByParentFiltersForAll,
      )
      const singleFilterByParentFiltersForFiltered = {
        tpopByTpopId: self.tpopGqlFilter.filtered,
      }
      // 2. prepare data filter
      let filterArrayInStore = self.dataFilter.tpopfreiwkontr
        ? [...getSnapshot(self.dataFilter.tpopfreiwkontr)]
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
        filterArrayInStore.push(initialTpopfreiwkontr)
      }
      // 3. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
        const singleFilter = nestedObjectAssign(
          {},
          singleFilterByHierarchy,
          singleFilterByParentFiltersForFiltered,
        )
        // add data filter
        const dataFilter = { ...filter }
        const filterValues = Object.entries(dataFilter).filter(
          (e) => e[1] !== null,
        )
        filterValues.forEach(([key, value]) => {
          const expression =
            tpopfreiwkontrType[key] === 'string' ? 'includes' : 'equalTo'
          singleFilter[key] = { [expression]: value }
        })
        // add node label filter
        if (self.nodeLabelFilter.tpopfreiwkontr) {
          singleFilter.label = {
            includesInsensitive: self.nodeLabelFilter.tpopfreiwkontr,
          }
        }
        // add mapFilter
        if (self.mapFilter) {
          singleFilter.tpopByTpopId.geomPoint = {
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

      const ekfGqlFilter = {
        all: Object.keys(singleFilterForAll).length
          ? singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('ekfGqlFilter:', ekfGqlFilter)

      return ekfGqlFilter
    },
    get ekfIsFiltered() {
      const firstFilterObject = {
        ...(self.ekfGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      let entries = Object.entries(firstFilterObject).filter(
        (e) => !['tpopByTpopId'].includes(e[0]),
      )
      return entries.length > 0
    },
    get tpopkontrGqlFilter() {
      return {
        or: [self.ekGqlFilter?.filtered, self.ekfGqlFilter.filtered],
      }
    },
    get tpopkontrIsFiltered() {
      return self.ekfIsFiltered ?? self.ekIsFiltered
    },
    beobGqlFilter(type) {
      // type can be: nichtBeurteilt, nichtZuzuordnen, zugeordnet
      // 1. prepare hiearchy filter
      const projId = self.projIdInActiveNodeArray
      const apId = self.apIdInActiveNodeArray
      // const popId = self.popIdInActiveNodeArray
      // const tpopId = self.tpopIdInActiveNodeArray

      const apFilter = {
        aeTaxonomyByArtId: {
          apartsByArtId: {
            // important: NEVER load from all species!
            some: {
              apId: { equalTo: apId ?? '99999999-9999-9999-9999-999999999999' },
            },
          },
        },
      }

      // Der Hierarchie-Filter auf Ebene Population und Teil-Population hat sich nicht bewährt und wurde nach kurzer Zeit wieder entfernt
      // const tpopHierarchyFilter = tpopId ? { tpopId: { equalTo: tpopId } } : {}
      // const popHierarchyFilter = popId
      //   ? { tpopByTpopId: { popId: { equalTo: popId } } }
      //   : {}
      const apHiearchyFilter = apId
        ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
        : {}
      const projHiearchyFilter = projId
        ? {
            tpopByTpopId: {
              popByPopId: { apByApId: { projId: { equalTo: projId } } },
            },
          }
        : {}
      let singleFilterByHierarchy = nestedObjectAssign(
        {},
        // tpopHierarchyFilter,
        // popHierarchyFilter,
        apHiearchyFilter,
        projHiearchyFilter,
      )
      const typeFilter = {
        wgs84Lat: { isNull: false },
      }
      if (type === 'zugeordnet') {
        typeFilter.tpopId = { isNull: false }
      }
      if (type === 'nichtBeurteilt') {
        typeFilter.tpopId = { isNull: true }
      }
      if (type === 'nichtZuzuordnen') {
        typeFilter.nichtZuordnen = { equalTo: true }
      }

      const singleFilterByParentFiltersForAll = {
        tpopByTpopId: self.tpopGqlFilter.all,
      }
      const singleFilterForAll =
        type === 'zugeordnet'
          ? nestedObjectAssign(
              typeFilter,
              apFilter,
              singleFilterByHierarchy,
              singleFilterByParentFiltersForAll,
            )
          : nestedObjectAssign(typeFilter, apFilter)
      const singleFilterByParentFiltersForFiltered = {
        tpopByTpopId: self.tpopGqlFilter.filtered,
      }

      // node label filter
      const nodeLabelFilter = self.nodeLabelFilter.beob
        ? {
            label: {
              includesInsensitive: self.nodeLabelFilter.beob,
            },
          }
        : {}
      // mapFilter
      const mapFilter = self.mapFilter
        ? {
            geomPoint: {
              coveredBy: self.mapFilter,
            },
          }
        : {}
      const singleFilter = nestedObjectAssign(
        typeFilter,
        apFilter,
        type === 'zugeordnet' ? singleFilterByHierarchy : {},
        type === 'zugeordnet' ? singleFilterByParentFiltersForFiltered : {},
        nodeLabelFilter,
        mapFilter,
      )

      const beobGqlFilter = {
        all: Object.keys(singleFilterForAll).length
          ? singleFilterForAll
          : { or: [] },
        filtered: singleFilter,
      }

      // console.log('beobGqlFilter:', { beobGqlFilter, type })

      return beobGqlFilter
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
