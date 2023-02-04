import { types, getParent, getSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'
import merge from 'lodash/merge'
import queryString from 'query-string'
import isUuid from 'is-uuid'

import NodeLabelFilter, {
  defaultValue as defaultNodeLabelFilter,
} from './NodeLabelFilter'
import Geojson from './Geojson'
import initialDataFilterValues from './DataFilter/initialValues'
import DataFilter from './DataFilter/types'
import { simpleTypes as popType, initial as initialPop } from './DataFilter/pop'
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
import { simpleTypes as apType, initial as initialAp } from './DataFilter/ap'
import appBaseUrl from '../../modules/appBaseUrl'

export default types
  .model('Tree', {
    // used to open tree2 on a specific activeNodeArray
    tree2Src: types.optional(types.string, ''),
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
    mapFilter: types.maybe(Geojson),
    refetcher: types.optional(types.number, 0),
  })
  .actions((self) => ({
    incrementRefetcher() {
      self.refetcher += 1
    },
    resetTree2Src() {
      self.tree2Src = ''
    },
    setTree2SrcByActiveNodeArray({ activeNodeArray, search }) {
      const iFrameSearch = queryString.parse(search)
      // need to alter projekteTabs:
      if (Array.isArray(iFrameSearch.projekteTabs)) {
        iFrameSearch.projekteTabs = iFrameSearch.projekteTabs
          // - remove non-tree2 values
          .filter((t) => t.includes('2'))
          // - rewrite tree2 values to tree values
          .map((t) => t.replace('2', ''))
      } else if (iFrameSearch.projekteTabs) {
        iFrameSearch.projekteTabs = [iFrameSearch.projekteTabs]
          // - remove non-tree2 values
          .filter((t) => t.includes('2'))
          // - rewrite tree2 values to tree values
          .map((t) => t.replace('2', ''))
      }
      const newSearch = queryString.stringify(iFrameSearch)
      // pass this via src to iframe
      const iFrameSrc = `${appBaseUrl().slice(
        0,
        -1,
      )}${`/Daten/${activeNodeArray.join('/')}`}?${newSearch}`
      self.tree2Src = iFrameSrc
    },
    setMapFilter(val) {
      self.mapFilter = val
    },
    emptyMapFilter() {
      self.setMapFilter(undefined)
    },
    setLastTouchedNode(val) {
      self.lastTouchedNode = val
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
    addOpenNodesForNodeArray(nodeArray) {
      const extraOpenNodes = []
      nodeArray.forEach((v, i) => {
        extraOpenNodes.push(nodeArray.slice(0, i + 1))
      })
      this.addOpenNodes(extraOpenNodes)
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
      // always set missing open nodes?
      self.addOpenNodesForNodeArray(val)
      self.activeNodeArray = val
    },
  }))
  .views((self) => ({
    get projectIsOpen() {
      return (
        self.openNodes.filter((n) => n[0] === 'Projekte' && !!n[1]).length > 0
      )
    },
    get activeFilterTable() {
      const aNA = getSnapshot(self.activeNodeArray)
      if (aNA.length > 10) {
        if (aNA[10] === 'Zaehlungen') return 'tpopkontrzaehl'
      }
      if (aNA.length > 8) {
        if (aNA[8] === 'Massnahmen') return 'tpopmassn'
        if (aNA[8] === 'Freiwilligen-Kontrollen') return 'tpopkontr'
        if (aNA[8] === 'Feld-Kontrollen') return 'tpopkontr'
        if (aNA[8] === 'Massnahmen-Berichte') return 'tpopmassnber'
        if (aNA[8] === 'Kontroll-Berichte') return 'tpopber'
        if (aNA[8] === 'Beobachtungen') return 'beob'
      }
      if (aNA.length > 7) {
        if (aNA[4] === 'AP-Ziele' && aNA[7] === 'Berichte') return 'zielber'
      }
      if (aNA.length > 6) {
        if (aNA[6] === 'Teil-Populationen') return 'tpop'
        if (aNA[6] === 'Kontroll-Berichte') return 'popber'
        if (aNA[6] === 'Massnahmen-Berichte') return 'popmassnber'
        if (aNA[6] === 'Massnahmen-Berichte') return 'popmassnber'
      }
      if (aNA.length > 4) {
        if (aNA[4] === 'Populationen') return 'pop'
        if (aNA[4] === 'AP-Ziele') return 'ziel'
        if (aNA[4] === 'AP-Erfolgskriterien') return 'erfkrit'
        if (aNA[4] === 'AP-Berichte') return 'apber'
        if (aNA[4] === 'Idealbiotop') return undefined // or pop?
        if (aNA[4] === 'Taxa') return 'apart'
        if (aNA[4] === 'assoziierte-Arten') return 'assozart'
        if (aNA[4] === 'EK-Frequenzen') return 'ekfrequenz'
        if (aNA[4] === 'EK-Zähleinheiten') return 'ekzaehleinheit'
        if (aNA[4] === 'nicht-beurteilte-Beobachtungen') return 'beob'
        if (aNA[4] === 'nicht-zuzuordnende-Beobachtungen') return 'beob'
        if (aNA[4] === 'Qualitaetskontrollen') return undefined
      }
      if (aNA.length > 2) {
        if (aNA[2] === 'Arten') return 'ap'
        if (aNA[2] === 'AP-Berichte') return 'apberuebersicht'
      }
      if (aNA.length > 1) {
        if (aNA[1] === 'Adressen') return 'adresse'
        if (aNA[1] === 'ApberrelevantGrundWerte')
          return 'tpopApberrelevantGrundWerte'
        if (aNA[1] === 'EkAbrechnungstypWerte') return 'ekAbrechnungstypWerte'
        if (aNA[1] === 'TpopkontrzaehlEinheitWerte')
          return 'tpopkontrzaehlEinheitWerte'
      }
      if (aNA[0] === 'Benutzer') return 'user'
      return undefined
    },
    get openProjekts() {
      const openNodes = getSnapshot(self.openNodes)
      const openProjekts = [
        ...new Set(
          openNodes.filter((n) => n[0] === 'Projekte' && n[1]).map((n) => n[1]),
        ),
      ]
      return openProjekts
    },
    get openAps() {
      const openNodes = getSnapshot(self.openNodes)
      const openAps = [
        ...new Set(
          openNodes
            .filter((n) => n[0] === 'Projekte' && n[2] === 'Arten' && n[3])
            .map((n) => n[3]),
        ),
      ]
      return openAps
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
        filterArrayInStore.push(initialAp)
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
    get apGqlFilterForTree() {
      const store = getParent(self)
      // 1. prepare data filter
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
        filterArrayInStore.push(initialAp)
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

      const apGqlFilter = { or: filterArrayWithoutEmptyObjects }

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
        const singleFilter = merge(
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
    get popGqlFilterForTree() {
      // 1. prepare data filter
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
      // 2. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
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

      const popGqlFilter = { or: filterArrayWithoutEmptyObjects }

      // console.log('popGqlFilter:', popGqlFilter)

      return popGqlFilter
    },
    get popIsFiltered() {
      const firstFilterObject = {
        ...(self.popGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      const entries = Object.entries(firstFilterObject).filter(
        (e) => !['projId', 'apId', 'apByApId', 'geomPoint'].includes(e[0]),
      )
      return entries.length > 0
    },
    get tpopGqlFilter() {
      // 1. prepare hiearchy filter
      const projId = self.projIdInActiveNodeArray
      const apId = self.apIdInActiveNodeArray
      const apHiearchyFilter = apId
        ? { popByPopId: { apId: { equalTo: apId } } }
        : {}
      const projHiearchyFilter = projId
        ? { popByPopId: { apByApId: { projId: { equalTo: projId } } } }
        : {}
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
        const singleFilter = merge(
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
    get tpopGqlFilterForTree() {
      // 1. prepare data filter
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
      // 2. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
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

      const tpopGqlFilter = { or: filterArrayWithoutEmptyObjects }

      // console.log('tpopGqlFilter:', tpopGqlFilter)

      return tpopGqlFilter
    },
    get tpopIsFiltered() {
      const firstFilterObject = {
        ...(self.tpopGqlFilter?.filtered?.or?.[0] ?? {}),
      }
      const entries = Object.entries(firstFilterObject).filter(
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
        const singleFilter = merge(
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
    get tpopmassnGqlFilterForTree() {
      // 1. prepare data filter
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
      // 2. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
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
        const singleFilter = merge(
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
    get ekGqlFilterForTree() {
      // 1. prepare data filter
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
      // 2. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
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
      // 1. prepare hiearchy filter
      const projId = self.projIdInActiveNodeArray
      const apId = self.apIdInActiveNodeArray
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
        const singleFilter = merge(
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
    get ekfGqlFilterForTree() {
      // 1. prepare data filter
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
      // 2. build data filter
      const filterArray = []
      for (const filter of filterArrayInStore) {
        // add hiearchy filter
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
    get tpopkontrIsFiltered() {
      return self.ekfIsFiltered ?? self.ekIsFiltered
    },
    beobGqlFilter(type) {
      // type can be: nichtBeurteilt, nichtZuzuordnen, zugeordnet
      // 1. prepare hiearchy filter
      const projId = self.projIdInActiveNodeArray
      // need list of all open apIds
      const openApIds = [
        ...new Set(self.openNodes.filter((n) => n[3]).map((n) => n[3])),
      ]
      const apId = self.apIdInActiveNodeArray

      const apFilter = {
        aeTaxonomyByArtId: {
          apartsByArtId: {
            // important: NEVER load from all species!
            some: {
              apId: { in: openApIds },
            },
          },
        },
      }

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
        type === 'zugeordnet'
          ? merge(
              merge(merge(typeFilter, apFilter), singleFilterByHierarchy),
              singleFilterByParentFiltersForAll,
            )
          : merge(typeFilter, apFilter)
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
      let singleFilter = merge(typeFilter, apFilter)
      if (type === 'zugeordnet') {
        singleFilter = merge(singleFilter, singleFilterByHierarchy)
        singleFilter = merge(
          singleFilter,
          singleFilterByParentFiltersForFiltered,
        )
      }
      singleFilter = merge(singleFilter, nodeLabelFilter)
      singleFilter = merge(singleFilter, mapFilter)

      const beobGqlFilter = {
        all: Object.keys(singleFilterForAll).length
          ? singleFilterForAll
          : { or: [] },
        filtered: singleFilter,
      }

      // console.log('beobGqlFilter:', { beobGqlFilter, type })

      return beobGqlFilter
    },
    beobGqlFilterForTree(type) {
      // type can be: nichtBeurteilt, nichtZuzuordnen, zugeordnet
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

      // merge all
      let singleFilter = typeFilter
      singleFilter = merge(singleFilter, nodeLabelFilter)
      singleFilter = merge(singleFilter, mapFilter)

      const beobGqlFilter = singleFilter

      // console.log('beobGqlFilter:', { beobGqlFilter, type })

      return beobGqlFilter
    },
  }))

export const defaultValue = {
  activeNodeArray: [],
  lastTouchedNode: [],
  openNodes: [],
  apFilter: true,
  nodeLabelFilter: defaultNodeLabelFilter,
}
