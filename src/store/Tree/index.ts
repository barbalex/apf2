import { types, getParent, getSnapshot } from 'mobx-state-tree'
import { isEqual } from 'es-toolkit'
import { merge } from 'es-toolkit'
import queryString from 'query-string'
import isUuid from 'is-uuid'

import { initialDataFilterValues } from './DataFilter/initialValues.ts'
import { DataFilter } from './DataFilter/types.ts'
import { simpleTypes as popType } from './DataFilter/pop.ts'
import {
  simpleTypes as tpopType,
  initial as initialTpop,
} from './DataFilter/tpop.ts'
import {
  simpleTypes as tpopmassnType,
  initial as initialTpopmassn,
} from './DataFilter/tpopmassn.ts'
import {
  simpleTypes as tpopfeldkontrType,
  initial as initialTpopfeldkontr,
} from './DataFilter/tpopfeldkontr.ts'
import {
  simpleTypes as tpopfreiwkontrType,
  initial as initialTpopfreiwkontr,
} from './DataFilter/tpopfreiwkontr.ts'
import { simpleTypes as apType, initial as initialAp } from './DataFilter/ap.ts'
import { appBaseUrl } from '../../modules/appBaseUrl.ts'

import {
  store as jotaiStore,
  addNotificationAtom,
  treeOpenNodesAtom,
  treeActiveNodeArrayAtom,
  treeProjIdInActiveNodeArrayAtom,
  treeApFilterAtom,
  treeSetApFilterAtom,
  treeMapFilterAtom,
  treeSetMapFilterAtom,
  treeNodeLabelFilterAtom,
} from '../../JotaiStore/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)

export const Tree = types
  .model('Tree', {
    dataFilter: types.optional(DataFilter, initialDataFilterValues),
  })
  .volatile(() => ({
    // Track nodeLabelFilter changes to make getters reactive
    nodeLabelFilterVersion: 0,
    // Track apFilter changes to make getters reactive
    apFilterVersion: 0,
    // Track mapFilter changes to make getters reactive
    mapFilterVersion: 0,
  }))
  .actions((self) => ({
    incrementNodeLabelFilterVersion() {
      self.nodeLabelFilterVersion += 1
    },
    incrementApFilterVersion() {
      self.apFilterVersion += 1
    },
    incrementMapFilterVersion() {
      mapFilterVersion += 1
    },
    afterCreate() {
      // Subscribe to jotai atom changes and increment version to trigger mobx reactions
      jotaiStore.sub(treeNodeLabelFilterAtom, () => {
        // Use queueMicrotask to avoid synchronous mutation during jotai update
        queueMicrotask(() => {
          self.incrementNodeLabelFilterVersion()
        })
      })
      jotaiStore.sub(treeApFilterAtom, () => {
        queueMicrotask(() => {
          self.incrementApFilterVersion()
        })
      })
      jotaiStore.sub(treeMapFilterAtom, () => {
        queueMicrotask(() => {
          self.incrementMapFilterVersion()
        })
      })
    },
    dataFilterEmptyTable({ table }) {
      self.dataFilter[table] = initialDataFilterValues[table]
    },
    dataFilterEmptyTab({ table, activeTab }) {
      if (self.dataFilter[table].length === 1) {
        const firstElement = self.dataFilter[table][0]
        Object.keys(firstElement).forEach((key) => (firstElement[key] = null))
        return
      }
      self.dataFilter[table].splice(activeTab, 1)
    },
    dataFilterAddOr({ table, val }) {
      self.dataFilter?.[table]?.push(val)
    },
    dataFilterSetValue({ table, key, value, index }) {
      if (index !== undefined) {
        if (!self.dataFilter[table][index]) {
          self.tree?.dataFilter?.[table]?.push(initialDataFilterValues[table])
        }
        self.dataFilter[table][index][key] = value
        return
      }
      self.dataFilter[table][key] = value
    },
    dataFilterEmpty() {
      self.dataFilter = initialDataFilterValues
    },
  }))
  .views((self) => ({
    // TODO: migrate to jotaiStore next
    get apIdInActiveNodeArray() {
      const activeNodeArray = jotaiStore.get(treeActiveNodeArrayAtom)
      if (activeNodeArray.length > 3 && activeNodeArray[2] === 'Arten') {
        const id = activeNodeArray[3]
        if (isUuid.anyNonNil(id)) return id
      }
      return undefined
    },
    get apGqlFilter() {
      const store = getParent(self)
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.apFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const apFilter = jotaiStore.get(treeApFilterAtom)
      // 1. prepare hierarchy filter
      const singleFilterByHierarchy = {}
      // 2. prepare data filter
      let filterArrayInStore =
        self.dataFilter.ap ? [...getSnapshot(self.dataFilter.ap)] : []
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialAp)
      }
      let setApFilter = false
      if (apFilter) {
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
          // need timeout or notification will not appear
          setTimeout(() =>
            addNotification({
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
        // add hierarchy filter
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
        if (nodeLabelFilter.ap) {
          singleFilter.label = {
            includesInsensitive: nodeLabelFilter.ap,
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
        all:
          Object.keys(singleFilterByHierarchy).length ?
            singleFilterByHierarchy
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('apGqlFilter:', apGqlFilter)

      return apGqlFilter
    },
    get apGqlFilterForTree() {
      const store = getParent(self)
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.apFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const apFilter = jotaiStore.get(treeApFilterAtom)
      // 1. prepare data filter
      let filterArrayInStore =
        self.dataFilter.ap ? [...getSnapshot(self.dataFilter.ap)] : []
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialAp)
      }
      let setApFilter = false
      if (apFilter) {
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
          jotaiStore.set(treeSetApFilterAtom, false)
          // need timeout or notification will not appear
          setTimeout(() =>
            addNotification({
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
        // add hierarchy filter
        const singleFilter = {}
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
        if (nodeLabelFilter.ap) {
          singleFilter.label = {
            includesInsensitive: nodeLabelFilter.ap,
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

      const apGqlFilter = { or: filterArrayWithoutEmptyObjects }

      // console.log('apGqlFilter:', apGqlFilter)

      return apGqlFilter
    },
    get artIsFiltered() {
      // Access volatile property to make this getter reactive to jotai changes
      self.apFilterVersion
      const apFilter = jotaiStore.get(treeApFilterAtom)
      const firstFilterObject = {
        ...(self.apGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      let entries = Object.entries(firstFilterObject).filter(
        (e) => e[0] !== 'projId',
      )
      // if apFilter is set: ignore that value
      if (apFilter) {
        entries = entries.filter(
          (e) => !(e[0] === 'bearbeitung' && isEqual(e[1], { in: [1, 2, 3] })),
        )
      }
      return entries.length > 0
    },
    get popGqlFilter() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // 1. prepare hierarchy filter
      const apId = self.apIdInActiveNodeArray
      const apHiearchyFilter = apId ? { apId: { equalTo: apId } } : {}
      const projHiearchyFilter = {}
      const singleFilterByHierarchy = merge(
        apHiearchyFilter,
        projHiearchyFilter,
      )
      const singleFilterByParentFiltersForAll = {
        apByApId: self.apGqlFilter.all,
      }
      const singleFilterForAll = merge(
        singleFilterByHierarchy,
        singleFilterByParentFiltersForAll,
      )
      const singleFilterByParentFiltersForFiltered = {
        apByApId: self.apGqlFilter.filtered,
      }
      // 2. prepare data filter
      let filterArrayInStore =
        self.dataFilter.pop ? [...getSnapshot(self.dataFilter.pop)] : []
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialTpop)
      }
      // 3. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hierarchy filter
        const singleFilter = {
          ...merge(
            singleFilterByHierarchy,
            singleFilterByParentFiltersForFiltered,
          ),
        }
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
        if (nodeLabelFilter.pop) {
          singleFilter.label = {
            includesInsensitive: nodeLabelFilter.pop,
          }
        }
        // add mapFilter
        if (mapFilter) {
          singleFilter.geomPoint = {
            coveredBy: mapFilter,
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
        all:
          Object.keys(singleFilterForAll).length ?
            singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('popGqlFilter:', popGqlFilter)

      return popGqlFilter
    },
    get popGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // 1. prepare data filter
      let filterArrayInStore =
        self.dataFilter.pop ? [...getSnapshot(self.dataFilter.pop)] : []
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialTpop)
      }
      // 2. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hierarchy filter
        const singleFilter = {}
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
        if (nodeLabelFilter.pop) {
          singleFilter.label = {
            includesInsensitive: nodeLabelFilter.pop,
          }
        }
        // add mapFilter
        if (mapFilter) {
          singleFilter.geomPoint = {
            coveredBy: mapFilter,
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

      const popGqlFilter = { or: filterArrayWithoutEmptyObjects }

      // console.log('popGqlFilter:', popGqlFilter)

      return popGqlFilter
    },
    get popIsFiltered() {
      const firstFilterObject = {
        ...(self.popGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      const entries = Object.entries(firstFilterObject).filter(
        (e) => !['apId', 'apByApId', 'geomPoint'].includes(e[0]),
      )
      return entries.length > 0
    },
    get tpopGqlFilter() {
      // Access volatile property to make this getter reactive to jotai changes
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // 1. prepare hierarchy filter
      const apId = self.apIdInActiveNodeArray
      const apHiearchyFilter =
        apId ? { popByPopId: { apId: { equalTo: apId } } } : {}
      const projHiearchyFilter = {}
      const singleFilterByHierarchy = merge(
        apHiearchyFilter,
        projHiearchyFilter,
      )
      const singleFilterByParentFiltersForAll = {
        popByPopId: self.popGqlFilter.all,
      }
      const singleFilterForAll = merge(
        singleFilterByHierarchy,
        singleFilterByParentFiltersForAll,
      )
      const singleFilterByParentFiltersForFiltered = {
        popByPopId: self.popGqlFilter.filtered,
      }
      // 2. prepare data filter
      let filterArrayInStore =
        self.dataFilter.tpop ? [...getSnapshot(self.dataFilter.tpop)] : []
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialTpop)
      }
      // 3. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hierarchy filter
        // BEWARE: merge without spreading leads to the same object being used during the for loop!
        const singleFilter = {
          ...merge(
            singleFilterByHierarchy,
            singleFilterByParentFiltersForFiltered,
          ),
        }
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
        if (nodeLabelFilter.tpop) {
          singleFilter.label = {
            includesInsensitive: nodeLabelFilter.tpop,
          }
        }
        // add mapFilter
        if (mapFilter) {
          singleFilter.geomPoint = {
            coveredBy: mapFilter,
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
        all:
          Object.keys(singleFilterForAll).length ?
            singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      return tpopGqlFilter
    },
    get tpopGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // 1. prepare data filter
      let filterArrayInStore =
        self.dataFilter.tpop ? [...getSnapshot(self.dataFilter.tpop)] : []
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialTpop)
      }
      // 2. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hierarchy filter
        const singleFilter = {}
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
        if (nodeLabelFilter.tpop) {
          singleFilter.label = {
            includesInsensitive: nodeLabelFilter.tpop,
          }
        }
        // add mapFilter
        if (mapFilter) {
          singleFilter.geomPoint = {
            coveredBy: mapFilter,
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

      const tpopGqlFilter = { or: filterArrayWithoutEmptyObjects }

      // console.log('tpopGqlFilter:', tpopGqlFilter)

      return tpopGqlFilter
    },
    get tpopIsFiltered() {
      const firstFilterObject = {
        ...(self.tpopGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      const entries = Object.entries(firstFilterObject).filter(
        (e) => !['apId', 'popId', 'popByPopId', 'geomPoint'].includes(e[0]),
      )
      return entries.length > 0
    },
    get tpopmassnGqlFilter() {
      // Access volatile property to make this getter reactive to jotai changes
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // 1. prepare hierarchy filter
      const apId = self.apIdInActiveNodeArray
      const apHiearchyFilter =
        apId ?
          { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
        : {}
      const projHiearchyFilter = {}
      const singleFilterByHierarchy = merge(
        apHiearchyFilter,
        projHiearchyFilter,
      )
      const singleFilterByParentFiltersForAll = {
        tpopByTpopId: self.tpopGqlFilter.all,
      }
      const singleFilterForAll = merge(
        singleFilterByHierarchy,
        singleFilterByParentFiltersForAll,
      )
      const singleFilterByParentFiltersForFiltered = {
        tpopByTpopId: self.tpopGqlFilter.filtered,
      }
      // 2. prepare data filter
      let filterArrayInStore =
        self.dataFilter.tpopmassn ?
          [...getSnapshot(self.dataFilter.tpopmassn)]
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialTpopmassn)
      }
      // 3. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hierarchy filter
        const singleFilter = {
          ...merge(
            singleFilterByHierarchy,
            singleFilterByParentFiltersForFiltered,
          ),
        }
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
        if (nodeLabelFilter.tpopmassn) {
          singleFilter.label = {
            includesInsensitive: nodeLabelFilter.tpopmassn,
          }
        }
        // add mapFilter
        if (mapFilter) {
          if (!singleFilter.tpopByTpopId) {
            singleFilter.tpopByTpopId = {}
          }
          singleFilter.tpopByTpopId.geomPoint = {
            coveredBy: mapFilter,
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
        all:
          Object.keys(singleFilterForAll).length ?
            singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('tpopmassnGqlFilter:', tpopmassnGqlFilter)

      return tpopmassnGqlFilter
    },
    get tpopmassnGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // 1. prepare data filter
      let filterArrayInStore =
        self.dataFilter.tpopmassn ?
          [...getSnapshot(self.dataFilter.tpopmassn)]
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialTpopmassn)
      }
      // 2. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hierarchy filter
        const singleFilter = {}
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
        if (nodeLabelFilter.tpopmassn) {
          singleFilter.label = {
            includesInsensitive: nodeLabelFilter.tpopmassn,
          }
        }
        // add mapFilter
        if (mapFilter) {
          if (!singleFilter.tpopByTpopId) {
            singleFilter.tpopByTpopId = {}
          }
          singleFilter.tpopByTpopId.geomPoint = {
            coveredBy: mapFilter,
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

      const tpopmassnGqlFilter = { or: filterArrayWithoutEmptyObjects }

      // console.log('tpopmassnGqlFilter:', tpopmassnGqlFilter)

      return tpopmassnGqlFilter
    },
    get tpopmassnIsFiltered() {
      const firstFilterObject = {
        ...(self.tpopmassnGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      // console.log('tpopmassnIsFiltered, firstFilterObject:', firstFilterObject)
      const entries = Object.entries(firstFilterObject).filter(
        (e) => !['apId', 'popId', 'tpopByTpopId', 'geomPoint'].includes(e[0]),
      )
      return entries.length > 0
    },
    get tpopmassnberGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const tpopId = self.tpopIdInActiveNodeArray
      if (tpopId) {
        gqlFilter.tpopId = { equalTo: tpopId }
      }
      // 2. node label filter
      if (nodeLabelFilter.tpopmassnber) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.tpopmassnber,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get tpopkontrzaehlEinheitWerteGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter: none
      // 2. node label filter
      if (nodeLabelFilter.tpopkontrzaehlEinheitWerte) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.tpopkontrzaehlEinheitWerte,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get ekAbrechnungstypWerteGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter: none
      // 2. node label filter
      if (nodeLabelFilter.ekAbrechnungstypWerte) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.ekAbrechnungstypWerte,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get tpopApberrelevantGrundWerteGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      // include a condition that ensures a filter is always set
      const gqlFilter = { id: { isNull: false } }
      // 1. hierarchy filter: none
      // 2. node label filter
      if (nodeLabelFilter.tpopApberrelevantGrundWerte) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.tpopApberrelevantGrundWerte,
        }
      }

      return gqlFilter
    },
    get adresseGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter: none
      // 2. node label filter
      if (nodeLabelFilter.adresse) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.adresse,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get userGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter: none
      // 2. node label filter
      if (nodeLabelFilter.user) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.user,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get apberuebersichtGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // node label filter
      if (nodeLabelFilter.apberuebersicht) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.apberuebersicht,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get zielGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = self.apIdInActiveNodeArray
      if (apId) {
        gqlFilter.apId = { equalTo: apId }
      }
      // 2. node label filter
      if (nodeLabelFilter.ziel) {
        gqlFilter.or = [
          { label: { includesInsensitive: nodeLabelFilter.ziel } },
        ]
        if (!isNaN(nodeLabelFilter.ziel)) {
          gqlFilter.or.push({ jahr: { equalTo: +nodeLabelFilter.ziel } })
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get apberGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = self.apIdInActiveNodeArray
      if (apId) {
        gqlFilter.apId = { equalTo: apId }
      }
      // 2. node label filter
      if (nodeLabelFilter.apber) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.apber,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get apartGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = self.apIdInActiveNodeArray
      if (apId) {
        gqlFilter.apId = { equalTo: apId }
      }
      // 2. node label filter
      if (nodeLabelFilter.apart) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.apart,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get assozartGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = self.apIdInActiveNodeArray
      if (apId) {
        gqlFilter.apId = { equalTo: apId }
      }
      // 2. node label filter
      if (nodeLabelFilter.assozart) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.assozart,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get erfkritGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = self.apIdInActiveNodeArray
      if (apId) {
        gqlFilter.apId = { equalTo: apId }
      }
      // 2. node label filter
      if (nodeLabelFilter.erfkrit) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.erfkrit,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get ekfrequenzGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = self.apIdInActiveNodeArray
      if (apId) {
        gqlFilter.apId = { equalTo: apId }
      }
      // 2. node label filter
      if (nodeLabelFilter.ekfrequenz) {
        gqlFilter.code = {
          includesInsensitive: nodeLabelFilter.ekfrequenz,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get ekzaehleinheitGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = self.apIdInActiveNodeArray
      if (apId) {
        gqlFilter.apId = { equalTo: apId }
      }
      // 2. node label filter
      if (nodeLabelFilter.ekzaehleinheit) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.ekzaehleinheit,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get popberGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const popId = self.popIdInActiveNodeArray
      if (popId) {
        gqlFilter.popId = { equalTo: popId }
      }
      // 2. node label filter
      if (nodeLabelFilter.popber) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.popber,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get popmassnberGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const popId = self.popIdInActiveNodeArray
      if (popId) {
        gqlFilter.popId = { equalTo: popId }
      }
      // 2. node label filter
      if (nodeLabelFilter.popmassnber) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.popmassnber,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get tpopkontrzaehlGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const tpopkontrId = self.tpopkontrIdInActiveNodeArray
      if (tpopkontrId) {
        gqlFilter.tpopkontrId = { equalTo: tpopkontrId }
      }
      // 2. node label filter
      if (nodeLabelFilter.tpopkontrzaehl) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.tpopkontrzaehl,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get tpopberGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const tpopId = self.tpopIdInActiveNodeArray
      if (tpopId) {
        gqlFilter.tpopId = { equalTo: tpopId }
      }
      // 2. node label filter
      if (nodeLabelFilter.tpopber) {
        gqlFilter.label = {
          includesInsensitive: nodeLabelFilter.tpopber,
        }
      }

      if (Object.keys(gqlFilter).length === 0) return { or: [] }

      return gqlFilter
    },
    get ekGqlFilter() {
      // Access volatile property to make this getter reactive to jotai changes
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // 1. prepare hierarchy filter
      const apId = self.apIdInActiveNodeArray
      const apHiearchyFilter =
        apId ?
          { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
        : {}
      const projHiearchyFilter = {}
      const singleFilterByHierarchy = merge(
        merge(
          {
            or: [
              { typ: { isNull: true } },
              { typ: { in: ['Zwischenbeurteilung', 'Ausgangszustand'] } },
            ],
          },
          apHiearchyFilter,
        ),
        projHiearchyFilter,
      )
      const singleFilterByParentFiltersForAll = {
        tpopByTpopId: self.tpopGqlFilter.all,
      }
      const singleFilterForAll = merge(
        singleFilterByHierarchy,
        singleFilterByParentFiltersForAll,
      )
      const singleFilterByParentFiltersForFiltered = {
        tpopByTpopId: self.tpopGqlFilter.filtered,
      }
      // 2. prepare data filter
      let filterArrayInStore =
        self.dataFilter.tpopfeldkontr ?
          [...getSnapshot(self.dataFilter.tpopfeldkontr)]
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialTpopfeldkontr)
      }
      // 3. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hierarchy filter
        const singleFilter = {
          ...merge(
            singleFilterByHierarchy,
            singleFilterByParentFiltersForFiltered,
          ),
        }
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
        if (nodeLabelFilter.tpopfeldkontr) {
          singleFilter.label = {
            includesInsensitive: nodeLabelFilter.tpopfeldkontr,
          }
        }
        // add mapFilter
        if (mapFilter) {
          if (!singleFilter.tpopByTpopId) {
            singleFilter.tpopByTpopId = {}
          }
          singleFilter.tpopByTpopId.geomPoint = {
            coveredBy: mapFilter,
          }
        }
        // Object need to filter by typ
        if (!singleFilter.typ) {
          singleFilter.typ = { distinctFrom: 'Freiwilligen-Erfolgskontrolle' }
        }
        // Object has filter criteria. Add it!
        filterArray.push(singleFilter)
      }

      // extra check to ensure no empty objects exist
      const filterArrayWithoutEmptyObjects = filterArray.filter(
        (el) => Object.keys(el).length > 0,
      )

      const ekGqlFilter = {
        all:
          Object.keys(singleFilterForAll).length ?
            singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('ekGqlFilter:', ekGqlFilter)

      return ekGqlFilter
    },
    get ekGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // 1. prepare data filter
      let filterArrayInStore =
        self.dataFilter.tpopfeldkontr ?
          [...getSnapshot(self.dataFilter.tpopfeldkontr)]
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialTpopfeldkontr)
      }
      // 2. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hierarchy filter
        const singleFilter = {}
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
        if (nodeLabelFilter.tpopkontr) {
          singleFilter.labelEk = {
            includesInsensitive: nodeLabelFilter.tpopkontr,
          }
        }
        // add mapFilter
        if (mapFilter) {
          if (!singleFilter.tpopByTpopId) {
            singleFilter.tpopByTpopId = {}
          }
          singleFilter.tpopByTpopId.geomPoint = {
            coveredBy: mapFilter,
          }
        }
        // Object need to filter by typ
        if (!singleFilter.typ) {
          singleFilter.typ = { distinctFrom: 'Freiwilligen-Erfolgskontrolle' }
        }
        // Object has filter criteria. Add it!
        filterArray.push(singleFilter)
      }

      // extra check to ensure no empty objects exist
      const filterArrayWithoutEmptyObjects = filterArray.filter(
        (el) => Object.keys(el).length > 0,
      )

      const ekGqlFilter = { or: filterArrayWithoutEmptyObjects }

      // console.log('ekGqlFilter:', ekGqlFilter)

      return ekGqlFilter
    },
    get ekIsFiltered() {
      const firstFilterObject = {
        ...(self.ekGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      const entries = Object.entries(firstFilterObject).filter(
        (e) => !['tpopByTpopId'].includes(e[0]),
      )
      return entries.length > 0
    },
    get ekfGqlFilter() {
      // Access volatile property to make this getter reactive to jotai changes
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // 1. prepare hierarchy filter
      const apId = self.apIdInActiveNodeArray
      const apHiearchyFilter =
        apId ?
          { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
        : {}
      const projHiearchyFilter = {}
      const singleFilterByHierarchy = merge(
        merge(
          { typ: { equalTo: 'Freiwilligen-Erfolgskontrolle' } },
          apHiearchyFilter,
        ),
        projHiearchyFilter,
      )
      const singleFilterByParentFiltersForAll = {
        tpopByTpopId: self.tpopGqlFilter.all,
      }
      const singleFilterForAll = merge(
        singleFilterByHierarchy,
        singleFilterByParentFiltersForAll,
      )
      const singleFilterByParentFiltersForFiltered = {
        tpopByTpopId: self.tpopGqlFilter.filtered,
      }
      // 2. prepare data filter
      let filterArrayInStore =
        self.dataFilter.tpopfreiwkontr ?
          [...getSnapshot(self.dataFilter.tpopfreiwkontr)]
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialTpopfreiwkontr)
      }
      // 3. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hierarchy filter
        const singleFilter = {
          ...merge(
            singleFilterByHierarchy,
            singleFilterByParentFiltersForFiltered,
          ),
        }
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
        if (nodeLabelFilter.tpopkontr) {
          singleFilter.labelEkf = {
            includesInsensitive: nodeLabelFilter.tpopkontr,
          }
        }
        // add mapFilter
        if (mapFilter) {
          if (!singleFilter.tpopByTpopId) {
            singleFilter.tpopByTpopId = {}
          }
          singleFilter.tpopByTpopId.geomPoint = {
            coveredBy: mapFilter,
          }
        }
        // Object need to filter by typ
        if (!singleFilter.typ) {
          singleFilter.typ = { equalTo: 'Freiwilligen-Erfolgskontrolle' }
        }
        filterArray.push(singleFilter)
      }

      // extra check to ensure no empty objects exist
      const filterArrayWithoutEmptyObjects = filterArray.filter(
        (el) => Object.keys(el).length > 0,
      )

      const ekfGqlFilter = {
        all:
          Object.keys(singleFilterForAll).length ?
            singleFilterForAll
          : { or: [] },
        filtered: { or: filterArrayWithoutEmptyObjects },
      }

      // console.log('ekfGqlFilter:', ekfGqlFilter)

      return ekfGqlFilter
    },
    get ekfGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // 1. prepare data filter
      let filterArrayInStore =
        self.dataFilter.tpopfreiwkontr ?
          [...getSnapshot(self.dataFilter.tpopfreiwkontr)]
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
        // If no filters were added: this empty element will be removed after looping
        filterArrayInStore.push(initialTpopfreiwkontr)
      }
      // 2. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hierarchy filter
        const singleFilter = {}
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
        if (nodeLabelFilter.tpopkontr) {
          singleFilter.labelEkf = {
            includesInsensitive: nodeLabelFilter.tpopkontr,
          }
        }
        // add mapFilter
        if (mapFilter) {
          if (!singleFilter.tpopByTpopId) {
            singleFilter.tpopByTpopId = {}
          }
          singleFilter.tpopByTpopId.geomPoint = {
            coveredBy: mapFilter,
          }
        }
        // Object needs to filter by typ
        if (!singleFilter.typ) {
          singleFilter.typ = { equalTo: 'Freiwilligen-Erfolgskontrolle' }
        }
        // Object has filter criteria. Add it!
        filterArray.push(singleFilter)
      }

      // extra check to ensure no empty objects exist
      const filterArrayWithoutEmptyObjects = filterArray.filter(
        (el) => Object.keys(el).length > 0,
      )

      const ekfGqlFilter = { or: filterArrayWithoutEmptyObjects }

      // console.log('ekfGqlFilter:', ekfGqlFilter)

      return ekfGqlFilter
    },
    get ekfIsFiltered() {
      const firstFilterObject = {
        ...(self.ekfGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      const entries = Object.entries(firstFilterObject).filter(
        (e) => !['tpopByTpopId'].includes(e[0]),
      )
      return entries.length > 0
    },
    get tpopkontrGqlFilter() {
      return {
        or: [self.ekGqlFilter?.filtered, self.ekfGqlFilter.filtered],
      }
    },
    beobGqlFilter(type) {
      // Access volatile property to make this getter reactive to jotai changes
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      // type can be: nichtBeurteilt, nichtZuzuordnen, zugeordnet
      // 1. prepare hierarchy filter
      const projId = jotaiStore.get(treeProjIdInActiveNodeArrayAtom)

      // need list of all open apIds
      // issue: 2023 passed. https://github.com/barbalex/apf2/issues/616
      // reason: ['Benutzer', '738eaf0c-35e5-11e9-97ea-57d86602b143', 'EKF', 2023]
      // Solution: check all positions in array
      const apId = self.apIdInActiveNodeArray
      const openNodes = jotaiStore.get(treeOpenNodesAtom)
      const openApIds =
        apId ?
          [apId]
        : [
            ...new Set(
              openNodes
                .filter((n) => n[0] && n[0] === 'Projekte')
                .filter((n) => n[1] && n[1] === projId)
                .filter((n) => n[2] && n[2] === 'Arten')
                .filter((n) => n[3])
                .map((n) => n[3]),
            ),
          ]

      const apFilter = {
        aeTaxonomyByArtId: {
          apartsByArtId: {
            // important: NEVER load from all species!
            some: {
              apId: { in: openApIds },
              // need to include nodeLabelFilter
              aeTaxonomyByArtId: {
                artname: { includesInsensitive: nodeLabelFilter.ap ?? '' },
              },
            },
          },
        },
      }

      const apHiearchyFilter =
        apId ?
          { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
        : {}
      const projHiearchyFilter = {}
      const singleFilterByHierarchy = merge(
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
        typeFilter.nichtZuordnen = { equalTo: false }
      }
      if (type === 'nichtZuzuordnen') {
        typeFilter.nichtZuordnen = { equalTo: true }
      }

      const singleFilterByParentFiltersForAll = {
        tpopByTpopId: self.tpopGqlFilter.all,
      }
      const singleFilterForAll =
        type === 'zugeordnet' ?
          merge(
            merge(merge(typeFilter, apFilter), singleFilterByHierarchy),
            singleFilterByParentFiltersForAll,
          )
        : merge(typeFilter, apFilter)
      const singleFilterByParentFiltersForFiltered = {
        tpopByTpopId: self.tpopGqlFilter.filtered,
      }

      // node label filter
      const nodeLabelFilterObj =
        nodeLabelFilter.beob ?
          {
            label: {
              includesInsensitive: nodeLabelFilter.beob,
            },
          }
        : {}
      // mapFilter
      const mapFilter =
        mapFilter ?
          {
            geomPoint: {
              coveredBy: mapFilter,
            },
          }
        : {}
      let singleFilter = merge(typeFilter, apFilter)
      if (type === 'zugeordnet') {
        singleFilter = merge(singleFilter, singleFilterByHierarchy)
        singleFilter = merge(
          singleFilter,
          singleFilterByParentFiltersForFiltered,
        )
      }
      singleFilter = merge(singleFilter, nodeLabelFilterObj)
      singleFilter = merge(singleFilter, mapFilter)

      const beobGqlFilter = {
        all:
          Object.keys(singleFilterForAll).length ?
            singleFilterForAll
          : { or: [] },
        filtered: singleFilter,
      }

      // console.log('beobGqlFilter:', { beobGqlFilter, nodeLabelFilter, type })

      return beobGqlFilter
    },
    get beobNichtBeurteiltGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      const filter = {
        wgs84Lat: { isNull: false },
        tpopId: { isNull: true },
        nichtZuordnen: { equalTo: false },
      }

      // node label filter
      if (nodeLabelFilter.beob) {
        filter.label = {
          includesInsensitive: nodeLabelFilter.beob,
        }
      }

      // mapFilter
      if (mapFilter) {
        filter.geomPoint = {
          coveredBy: mapFilter,
        }
      }

      return filter
    },
    get beobNichtZuzuordnenGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      const filter = {
        wgs84Lat: { isNull: false },
        nichtZuordnen: { equalTo: true },
      }

      // node label filter
      if (nodeLabelFilter.beob) {
        filter.label = {
          includesInsensitive: nodeLabelFilter.beob,
        }
      }

      // mapFilter
      if (mapFilter) {
        filter.geomPoint = {
          coveredBy: mapFilter,
        }
      }

      return filter
    },
    get beobZugeordnetGqlFilterForTree() {
      // Access volatile property to make this getter reactive to jotai changes
      self.nodeLabelFilterVersion
      self.mapFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      const filter = {
        wgs84Lat: { isNull: false },
        tpopId: { isNull: false },
      }

      // node label filter
      if (nodeLabelFilter.beob) {
        filter.label = {
          includesInsensitive: nodeLabelFilter.beob,
        }
      }

      // mapFilter
      if (mapFilter) {
        filter.geomPoint = {
          coveredBy: mapFilter,
        }
      }

      return filter
    },
  }))

export const defaultValue = {
  apFilter: true,
}
