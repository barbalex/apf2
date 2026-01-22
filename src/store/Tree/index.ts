import { types, getParent } from 'mobx-state-tree'
import { isEqual } from 'es-toolkit'
import { merge } from 'es-toolkit'
import queryString from 'query-string'
import isUuid from 'is-uuid'

import { appBaseUrl } from '../../modules/appBaseUrl.ts'
import { simpleTypes as popType } from './DataFilter/pop.ts'
import { simpleTypes as tpopmassnType } from './DataFilter/tpopmassn.ts'
import { simpleTypes as tpopfeldkontrType } from './DataFilter/tpopfeldkontr.ts'
import { simpleTypes as tpopfreiwkontrType } from './DataFilter/tpopfreiwkontr.ts'

import {
  store as jotaiStore,
  addNotificationAtom,
  treeOpenNodesAtom,
  treeActiveNodeArrayAtom,
  treeProjIdInActiveNodeArrayAtom,
  treeApIdInActiveNodeArrayAtom,
  treePopIdInActiveNodeArrayAtom,
  treeTpopIdInActiveNodeArrayAtom,
  treeTpopkontrIdInActiveNodeArrayAtom,
  treeApFilterAtom,
  treeSetApFilterAtom,
  treeMapFilterAtom,
  treeSetMapFilterAtom,
  treeNodeLabelFilterAtom,
  treeDataFilterAtom,
  treeApGqlFilterAtom,
  treeApGqlFilterForTreeAtom,
  treePopGqlFilterAtom,
  treePopGqlFilterForTreeAtom,
  treeTpopGqlFilterAtom,
  treeTpopGqlFilterForTreeAtom,
  treeTpopmassnGqlFilterAtom,
  treeTpopmassnGqlFilterForTreeAtom,
  treeTpopmassnberGqlFilterForTreeAtom,
  treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom,
} from '../../JotaiStore/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)

export const Tree = types
  .model('Tree', {})
  .volatile(() => ({
    // Track nodeLabelFilter changes to make getters reactive
    nodeLabelFilterVersion: 0,
    // Track apFilter changes to make getters reactive
    apFilterVersion: 0,
    // Track mapFilter changes to make getters reactive
    mapFilterVersion: 0,
    // Track dataFilter changes to make getters reactive
    dataFilterVersion: 0,
    // Track activeNodeArray changes to make getters reactive
    activeNodeArrayVersion: 0,
  }))
  .actions((self) => ({
    incrementNodeLabelFilterVersion() {
      self.nodeLabelFilterVersion += 1
    },
    incrementApFilterVersion() {
      self.apFilterVersion += 1
    },
    incrementMapFilterVersion() {
      self.mapFilterVersion += 1
    },
    incrementDataFilterVersion() {
      self.dataFilterVersion += 1
    },
    incrementActiveNodeArrayVersion() {
      self.activeNodeArrayVersion += 1
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
      jotaiStore.sub(treeDataFilterAtom, () => {
        queueMicrotask(() => {
          self.incrementDataFilterVersion()
        })
      })
      jotaiStore.sub(treeActiveNodeArrayAtom, () => {
        queueMicrotask(() => {
          self.incrementActiveNodeArrayVersion()
        })
      })
    },
  }))
  .views((self) => ({
    get apGqlFilter() {
      return jotaiStore.get(treeApGqlFilterAtom)
    },
    get apGqlFilterForTree() {
      return jotaiStore.get(treeApGqlFilterForTreeAtom)
    },
    get popGqlFilter() {
      return jotaiStore.get(treePopGqlFilterAtom)
    },
    get popGqlFilterForTree() {
      return jotaiStore.get(treePopGqlFilterForTreeAtom)
    },
    get tpopGqlFilter() {
      return jotaiStore.get(treeTpopGqlFilterAtom)
    },
    get tpopGqlFilterForTree() {
      return jotaiStore.get(treeTpopGqlFilterForTreeAtom)
    },
    get tpopmassnGqlFilter() {
      return jotaiStore.get(treeTpopmassnGqlFilterAtom)
    },
    get tpopmassnGqlFilterForTree() {
      return jotaiStore.get(treeTpopmassnGqlFilterForTreeAtom)
    },
    get tpopmassnberGqlFilterForTree() {
      return jotaiStore.get(treeTpopmassnberGqlFilterForTreeAtom)
    },
    get tpopkontrzaehlEinheitWerteGqlFilterForTree() {
      return jotaiStore.get(treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = jotaiStore.get(treeApIdInActiveNodeArrayAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = jotaiStore.get(treeApIdInActiveNodeArrayAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = jotaiStore.get(treeApIdInActiveNodeArrayAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = jotaiStore.get(treeApIdInActiveNodeArrayAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = jotaiStore.get(treeApIdInActiveNodeArrayAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = jotaiStore.get(treeApIdInActiveNodeArrayAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const apId = jotaiStore.get(treeApIdInActiveNodeArrayAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const popId = jotaiStore.get(treePopIdInActiveNodeArrayAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const popId = jotaiStore.get(treePopIdInActiveNodeArrayAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const tpopkontrId = jotaiStore.get(treeTpopkontrIdInActiveNodeArrayAtom)
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
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const gqlFilter = {}
      // 1. hierarchy filter
      const tpopId = jotaiStore.get(treeTpopIdInActiveNodeArrayAtom)
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
      self.dataFilterVersion
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      const dataFilter = jotaiStore.get(treeDataFilterAtom)
      // 1. prepare hierarchy filter
      const apId = jotaiStore.get(treeApIdInActiveNodeArrayAtom)
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
        dataFilter.tpopfeldkontr ? [...dataFilter.tpopfeldkontr] : []
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
      self.dataFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      const dataFilter = jotaiStore.get(treeDataFilterAtom)
      // 1. prepare data filter
      let filterArrayInStore =
        dataFilter.tpopfeldkontr ? [...dataFilter.tpopfeldkontr] : []
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
    get ekfGqlFilter() {
      // Access volatile property to make this getter reactive to jotai changes
      self.mapFilterVersion
      self.dataFilterVersion
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      const dataFilter = jotaiStore.get(treeDataFilterAtom)
      // 1. prepare hierarchy filter
      const apId = jotaiStore.get(treeApIdInActiveNodeArrayAtom)
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
        dataFilter.tpopfreiwkontr ? [...dataFilter.tpopfreiwkontr] : []
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
      self.dataFilterVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      const dataFilter = jotaiStore.get(treeDataFilterAtom)
      // 1. prepare data filter
      let filterArrayInStore =
        dataFilter.tpopfreiwkontr ? [...dataFilter.tpopfreiwkontr] : []
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
    get tpopkontrGqlFilter() {
      return {
        or: [self.ekGqlFilter?.filtered, self.ekfGqlFilter.filtered],
      }
    },
    beobGqlFilter(type) {
      // Access volatile property to make this getter reactive to jotai changes
      self.mapFilterVersion
      self.activeNodeArrayVersion
      const nodeLabelFilter = jotaiStore.get(treeNodeLabelFilterAtom)
      const mapFilter = jotaiStore.get(treeMapFilterAtom)
      // type can be: nichtBeurteilt, nichtZuzuordnen, zugeordnet
      // 1. prepare hierarchy filter
      const projId = jotaiStore.get(treeProjIdInActiveNodeArrayAtom)

      // need list of all open apIds
      // issue: 2023 passed. https://github.com/barbalex/apf2/issues/616
      // reason: ['Benutzer', '738eaf0c-35e5-11e9-97ea-57d86602b143', 'EKF', 2023]
      // Solution: check all positions in array
      const apId = jotaiStore.get(treeApIdInActiveNodeArrayAtom)
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
      const mapFilterObj =
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
      singleFilter = merge(singleFilter, mapFilterObj)

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
