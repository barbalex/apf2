import { createStore, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import queryString from 'query-string'
import { isEqual, merge } from 'es-toolkit'
import isUuid from 'is-uuid'

import { constants } from '../modules/constants.ts'
import { appBaseUrl } from '../modules/appBaseUrl.ts'
import { initialDataFilterValues } from './initialDataFilterValues.ts'
import { simpleTypes as apType } from './DataFilter/ap.ts'
import { simpleTypes as popType } from './DataFilter/pop.ts'
import { simpleTypes as tpopType } from './DataFilter/tpop.ts'
import { simpleTypes as tpopmassnType } from './DataFilter/tpopmassn.ts'
import {
  simpleTypes as tpopfeldkontrType,
  initial as initialTpopfeldkontr,
} from './DataFilter/tpopfeldkontr.ts'
import {
  simpleTypes as tpopfreiwkontrType,
  initial as initialTpopfreiwkontr,
} from './DataFilter/tpopfreiwkontr.ts'

function atomWithToggleAndStorage(key, initialValue, storage) {
  const anAtom = atomWithStorage(key, initialValue, storage)
  const derivedAtom = atom(
    (get) => get(anAtom),
    (get, set, nextValue) => {
      const update = nextValue ?? !get(anAtom)
      set(anAtom, update)
    },
  )

  return derivedAtom
}

export const store = createStore()

// Tree atoms (migrated from mobx)
export const treeOpenNodesAtom = atom([])
export const treeSetOpenNodesAtom = atom(
  (get) => null,
  (get, set, val) => {
    // val should always be created from a snapshot of openNodes
    // to ensure not mutating openNodes!!!
    // need set to ensure contained arrays are unique
    const uniqueSet = new Set(val)
    set(treeOpenNodesAtom, Array.from(uniqueSet))
  },
)

export const treeAddOpenNodesAtom = atom(
  (get) => null,
  (get, set, nodes) => {
    // need set to ensure contained arrays are unique
    const currentOpenNodes = get(treeOpenNodesAtom)
    const uniqueSet = new Set([...currentOpenNodes, ...nodes])
    set(treeOpenNodesAtom, Array.from(uniqueSet))
  },
)

export const treeActiveNodeArrayAtom = atom([])

export const treeProjIdInActiveNodeArrayAtom = atom((get) => {
  const activeNodeArray = get(treeActiveNodeArrayAtom)
  if (activeNodeArray.includes('Projekte')) {
    const indexOfId = activeNodeArray.indexOf('Projekte') + 1
    if (activeNodeArray.length > indexOfId) {
      const id = activeNodeArray?.[indexOfId]
      if (isUuid.anyNonNil(id)) return id
    }
  }
  return undefined
})

export const treeApIdInActiveNodeArrayAtom = atom((get) => {
  const activeNodeArray = get(treeActiveNodeArrayAtom)
  if (activeNodeArray.length > 3 && activeNodeArray[2] === 'Arten') {
    const id = activeNodeArray[3]
    if (isUuid.anyNonNil(id)) return id
  }
  return undefined
})

export const treePopIdInActiveNodeArrayAtom = atom((get) => {
  const activeNodeArray = get(treeActiveNodeArrayAtom)
  if (activeNodeArray.length > 5 && activeNodeArray[4] === 'Populationen') {
    const id = activeNodeArray[5]
    if (isUuid.anyNonNil(id)) return id
  }
  return undefined
})

export const treeTpopIdInActiveNodeArrayAtom = atom((get) => {
  const activeNodeArray = get(treeActiveNodeArrayAtom)
  if (
    activeNodeArray.length > 7 &&
    activeNodeArray[6] === 'Teil-Populationen'
  ) {
    const id = activeNodeArray[7]
    if (isUuid.anyNonNil(id)) return id
  }
  return undefined
})

export const treeTpopkontrIdInActiveNodeArrayAtom = atom((get) => {
  const activeNodeArray = get(treeActiveNodeArrayAtom)
  if (
    activeNodeArray.length > 9 &&
    (activeNodeArray[8] === 'Feld-Kontrollen' ||
      activeNodeArray[8] === 'Freiwilligen-Kontrollen')
  ) {
    const id = activeNodeArray[9]
    if (isUuid.anyNonNil(id)) return id
  }
  return undefined
})

// IsFiltered atoms - these check if filters are active
export const treeArtIsFilteredAtom = atom((get) => {
  const apFilter = get(treeApFilterAtom)
  const apGqlFilter = get(treeApGqlFilterAtom)
  const firstFilterObject = {
    ...(apGqlFilter?.filtered?.or?.[0] ?? {}),
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
})

export const treePopIsFilteredAtom = atom((get) => {
  const popGqlFilter = get(treePopGqlFilterAtom)
  const firstFilterObject = {
    ...(popGqlFilter?.filtered?.or?.[0] ?? {}),
  }
  const entries = Object.entries(firstFilterObject).filter(
    (e) => !['apId', 'apByApId', 'geomPoint'].includes(e[0]),
  )
  return entries.length > 0
})

export const treeTpopIsFilteredAtom = atom((get) => {
  const tpopGqlFilter = get(treeTpopGqlFilterAtom)
  const firstFilterObject = {
    ...(tpopGqlFilter?.filtered?.or?.[0] ?? {}),
  }
  const entries = Object.entries(firstFilterObject).filter(
    (e) => !['apId', 'popId', 'popByPopId', 'geomPoint'].includes(e[0]),
  )
  return entries.length > 0
})

export const treeTpopmassnIsFilteredAtom = atom((get) => {
  const tpopmassnGqlFilter = get(treeTpopmassnGqlFilterAtom)
  const firstFilterObject = {
    ...(tpopmassnGqlFilter?.filtered?.or?.[0] ?? {}),
  }
  const entries = Object.entries(firstFilterObject).filter(
    (e) => !['apId', 'popId', 'tpopByTpopId', 'geomPoint'].includes(e[0]),
  )
  return entries.length > 0
})

export const treeEkIsFilteredAtom = atom((get) => {
  const ekGqlFilter = get(treeEkGqlFilterAtom)
  const firstFilterObject = {
    ...(ekGqlFilter?.filtered?.or?.[0] ?? {}),
  }
  const entries = Object.entries(firstFilterObject).filter(
    (e) => !['tpopByTpopId'].includes(e[0]),
  )
  return entries.length > 0
})

export const treeEkfIsFilteredAtom = atom((get) => {
  const ekfGqlFilter = get(treeEkfGqlFilterAtom)
  const firstFilterObject = {
    ...(ekfGqlFilter?.filtered?.or?.[0] ?? {}),
  }
  const entries = Object.entries(firstFilterObject).filter(
    (e) => !['tpopByTpopId'].includes(e[0]),
  )
  return entries.length > 0
})

// GqlFilter atoms - these build GraphQL filters
export const treeApGqlFilterAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const apFilter = get(treeApFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare hierarchy filter
  const singleFilterByHierarchy = {}

  // 2. prepare data filter
  let filterArrayInStore = dataFilter.ap ? [...dataFilter.ap] : []
  if (filterArrayInStore.length > 1) {
    // check if last is empty
    // empty last is just temporary because user created new "oder" and has not yet input criteria
    // remove it or filter result will be wrong (show all) if criteria.length > 1!
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    // Add empty filter if no criteria exist yet
    filterArrayInStore.push(initialDataFilterValues.ap[0])
  }

  let setApFilter = false
  if (apFilter) {
    setApFilter = true
    const conflictingFilterExists = filterArrayInStore.some((filter) => {
      const apFilterKeys = Object.entries(filter)
        .filter((e) => e[1] !== null)
        .map(([key]) => key)
      return apFilterKeys.some((val) => ['bearbeitung', 'apId'].includes(val))
    })
    if (conflictingFilterExists) {
      setApFilter = false
      store.set(treeSetApFilterAtom, false)
      // need timeout or notification will not appear
      setTimeout(() => {
        store.set(addNotificationAtom, {
          message:
            'Der "nur AP"-Filter wurde ausgeschaltet. Er verträgt sich nicht mit dem Formular-Filter',
          options: {
            variant: 'info',
          },
        })
      })
    }
  }

  const filterArray = []
  for (const filter of filterArrayInStore) {
    const singleFilter = { ...singleFilterByHierarchy }

    // add apFilter
    if (setApFilter) {
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
    if (Object.values(singleFilter).filter((v) => v !== null).length === 0) {
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

  return apGqlFilter
})

export const treeApGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const apFilter = get(treeApFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare data filter
  let filterArrayInStore = dataFilter.ap ? [...dataFilter.ap] : []
  if (filterArrayInStore.length > 1) {
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    filterArrayInStore.push(initialDataFilterValues.ap[0])
  }

  let setApFilter = false
  if (apFilter) {
    setApFilter = true
    const conflictingFilterExists = filterArrayInStore.some((filter) => {
      const apFilterKeys = Object.entries(filter)
        .filter((e) => e[1] !== null)
        .map(([key]) => key)
      return apFilterKeys.some((val) => ['bearbeitung', 'apId'].includes(val))
    })
    if (conflictingFilterExists) {
      setApFilter = false
      store.set(treeSetApFilterAtom, false)
      // need timeout or notification will not appear
      setTimeout(() => {
        store.set(addNotificationAtom, {
          message:
            'Der "nur AP"-Filter wurde ausgeschaltet. Er verträgt sich nicht mit dem Formular-Filter',
          options: {
            variant: 'info',
          },
        })
      })
    }
  }

  const filterArray = []
  for (const filter of filterArrayInStore) {
    const singleFilter = {}

    // add apFilter
    if (setApFilter) {
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
    if (Object.values(singleFilter).filter((v) => v !== null).length === 0) {
      break
    }
    filterArray.push(singleFilter)
  }

  const filterArrayWithoutEmptyObjects = filterArray.filter(
    (el) => Object.keys(el).length > 0,
  )

  const apGqlFilter = { or: filterArrayWithoutEmptyObjects }

  return apGqlFilter
})

export const treePopGqlFilterAtom = atom((get) => {
  // Access jotai atoms
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)
  const apId = get(treeApIdInActiveNodeArrayAtom)

  // Access jotai atom for parent filter
  const apGqlFilter = get(treeApGqlFilterAtom)

  // 1. prepare hierarchy filter
  const apHiearchyFilter = apId ? { apId: { equalTo: apId } } : {}
  const projHiearchyFilter = {}
  const singleFilterByHierarchy = merge(apHiearchyFilter, projHiearchyFilter)
  const singleFilterByParentFiltersForAll = {
    apByApId: apGqlFilter.all,
  }
  const singleFilterForAll = merge(
    singleFilterByHierarchy,
    singleFilterByParentFiltersForAll,
  )
  const singleFilterByParentFiltersForFiltered = {
    apByApId: apGqlFilter.filtered,
  }

  // 2. prepare data filter
  let filterArrayInStore = dataFilter.pop ? [...dataFilter.pop] : []
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
    filterArrayInStore.push(initialDataFilterValues.pop[0])
  }

  // 3. build data filter
  const filterArray = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    const singleFilter = {
      ...merge(singleFilterByHierarchy, singleFilterByParentFiltersForFiltered),
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
    if (Object.values(singleFilter).filter((v) => v !== null).length === 0) {
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

  return popGqlFilter
})

export const treePopGqlFilterForTreeAtom = atom((get) => {
  // Access jotai atoms
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare data filter
  let filterArrayInStore = dataFilter.pop ? [...dataFilter.pop] : []
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
    filterArrayInStore.push(initialDataFilterValues.pop[0])
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
    if (Object.values(singleFilter).filter((v) => v !== null).length === 0) {
      break
    }
    filterArray.push(singleFilter)
  }

  // extra check to ensure no empty objects exist
  const filterArrayWithoutEmptyObjects = filterArray.filter(
    (el) => Object.keys(el).length > 0,
  )

  const popGqlFilter = { or: filterArrayWithoutEmptyObjects }

  return popGqlFilter
})

export const treeTpopGqlFilterAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)
  const apId = get(treeApIdInActiveNodeArrayAtom)

  // Access jotai atom for parent filter
  const popGqlFilter = get(treePopGqlFilterAtom)

  // 1. prepare hierarchy filter
  const apHiearchyFilter = apId
    ? { popByPopId: { apId: { equalTo: apId } } }
    : {}
  const projHiearchyFilter = {}
  const singleFilterByHierarchy = merge(apHiearchyFilter, projHiearchyFilter)
  const singleFilterByParentFiltersForAll = {
    popByPopId: popGqlFilter.all,
  }
  const singleFilterForAll = merge(
    singleFilterByHierarchy,
    singleFilterByParentFiltersForAll,
  )
  const singleFilterByParentFiltersForFiltered = {
    popByPopId: popGqlFilter.filtered,
  }

  // 2. prepare data filter
  let filterArrayInStore = dataFilter.tpop ? [...dataFilter.tpop] : []
  if (filterArrayInStore.length > 1) {
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    filterArrayInStore.push(initialDataFilterValues.tpop[0])
  }

  // 3. build data filter
  const filterArray = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    // BEWARE: merge without spreading leads to the same object being used during the for loop!
    const singleFilter = {
      ...merge(singleFilterByHierarchy, singleFilterByParentFiltersForFiltered),
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
    if (Object.values(singleFilter).filter((v) => v !== null).length === 0) {
      break
    }
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

  return tpopGqlFilter
})

export const treeTpopGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare data filter
  let filterArrayInStore = dataFilter.tpop ? [...dataFilter.tpop] : []
  if (filterArrayInStore.length > 1) {
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    filterArrayInStore.push(initialDataFilterValues.tpop[0])
  }

  // 2. build data filter
  const filterArray = []
  for (const filter of filterArrayInStore) {
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
    if (Object.values(singleFilter).filter((v) => v !== null).length === 0) {
      break
    }
    filterArray.push(singleFilter)
  }

  // extra check to ensure no empty objects exist
  const filterArrayWithoutEmptyObjects = filterArray.filter(
    (el) => Object.keys(el).length > 0,
  )

  const tpopGqlFilter = { or: filterArrayWithoutEmptyObjects }

  return tpopGqlFilter
})

export const treeTpopmassnGqlFilterAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)
  const apId = get(treeApIdInActiveNodeArrayAtom)
  const tpopGqlFilter = get(treeTpopGqlFilterAtom)

  // 1. prepare hierarchy filter
  const apHiearchyFilter = apId
    ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
    : {}
  const projHiearchyFilter = {}
  const singleFilterByHierarchy = merge(apHiearchyFilter, projHiearchyFilter)
  const singleFilterByParentFiltersForAll = {
    tpopByTpopId: tpopGqlFilter.all,
  }
  const singleFilterForAll = merge(
    singleFilterByHierarchy,
    singleFilterByParentFiltersForAll,
  )
  const singleFilterByParentFiltersForFiltered = {
    tpopByTpopId: tpopGqlFilter.filtered,
  }
  // 2. prepare data filter
  const initialTpopmassn = {
    typ: null,
    beschreibung: null,
    jahr: null,
    datum: null,
    bearbeiter: null,
    bemerkungen: null,
    planVorhanden: null,
    planBezeichnung: null,
    flaeche: null,
    markierung: null,
    anzTriebe: null,
    anzPflanzen: null,
    anzPflanzstellen: null,
    wirtspflanze: null,
    herkunftPop: null,
    sammeldatum: null,
    vonAnzahlIndividuen: null,
    form: null,
    pflanzanordnung: null,
  }
  let filterArrayInStore = dataFilter.tpopmassn ? [...dataFilter.tpopmassn] : []
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
      ...merge(singleFilterByHierarchy, singleFilterByParentFiltersForFiltered),
    }
    // add data filter
    const dataFilterTpopmassn = { ...filter }
    const tpopmassnFilterValues = Object.entries(dataFilterTpopmassn).filter(
      (e) => e[1] !== null,
    )
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
    if (Object.values(singleFilter).filter((v) => v !== null).length === 0) {
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

  return tpopmassnGqlFilter
})

export const treeTpopmassnGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare data filter
  const initialTpopmassn = {
    typ: null,
    beschreibung: null,
    jahr: null,
    datum: null,
    bearbeiter: null,
    bemerkungen: null,
    planVorhanden: null,
    planBezeichnung: null,
    flaeche: null,
    markierung: null,
    anzTriebe: null,
    anzPflanzen: null,
    anzPflanzstellen: null,
    wirtspflanze: null,
    herkunftPop: null,
    sammeldatum: null,
    vonAnzahlIndividuen: null,
    form: null,
    pflanzanordnung: null,
  }
  let filterArrayInStore = dataFilter.tpopmassn ? [...dataFilter.tpopmassn] : []
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
    const tpopmassnFilterValues = Object.entries(dataFilterTpopmassn).filter(
      (e) => e[1] !== null,
    )
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
    if (Object.values(singleFilter).filter((v) => v !== null).length === 0) {
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

  return tpopmassnGqlFilter
})

export const treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom = atom(
  (get) => {
    const nodeLabelFilter = get(treeNodeLabelFilterAtom)
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
)

export const treeEkAbrechnungstypWerteGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
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
})

export const treeTpopApberrelevantGrundWerteGqlFilterForTreeAtom = atom(
  (get) => {
    const nodeLabelFilter = get(treeNodeLabelFilterAtom)
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
)

export const treeAdresseGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
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
})

export const treeUserGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // node label filter
  if (nodeLabelFilter.user) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.user,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
})

export const treeApberuebersichtGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // node label filter
  if (nodeLabelFilter.apberuebersicht) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.apberuebersicht,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
})

export const treeEkGqlFilterAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)
  const tpopGqlFilter = get(treeTpopGqlFilterAtom)

  // 1. prepare hierarchy filter
  const apId = get(treeApIdInActiveNodeArrayAtom)
  const apHiearchyFilter = apId
    ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
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
    tpopByTpopId: tpopGqlFilter.all,
  }
  const singleFilterForAll = merge(
    singleFilterByHierarchy,
    singleFilterByParentFiltersForAll,
  )
  const singleFilterByParentFiltersForFiltered = {
    tpopByTpopId: tpopGqlFilter.filtered,
  }

  // 2. prepare data filter
  let filterArrayInStore = dataFilter.tpopfeldkontr
    ? [...dataFilter.tpopfeldkontr]
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
      ...merge(singleFilterByHierarchy, singleFilterByParentFiltersForFiltered),
    }
    // add data filter
    const dataFilterObj = { ...filter }
    const filterValues = Object.entries(dataFilterObj).filter(
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
    all: Object.keys(singleFilterForAll).length
      ? singleFilterForAll
      : { or: [] },
    filtered: { or: filterArrayWithoutEmptyObjects },
  }

  return ekGqlFilter
})

export const treeEkGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare data filter
  let filterArrayInStore = dataFilter.tpopfeldkontr
    ? [...dataFilter.tpopfeldkontr]
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
    const filterValues = Object.entries(dataFilter).filter((e) => e[1] !== null)
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

  return ekGqlFilter
})

export const treeEkfGqlFilterAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)
  const tpopGqlFilter = get(treeTpopGqlFilterAtom)

  // 1. prepare hierarchy filter
  const apId = get(treeApIdInActiveNodeArrayAtom)
  const apHiearchyFilter = apId
    ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
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
    tpopByTpopId: tpopGqlFilter.all,
  }
  const singleFilterForAll = merge(
    singleFilterByHierarchy,
    singleFilterByParentFiltersForAll,
  )
  const singleFilterByParentFiltersForFiltered = {
    tpopByTpopId: tpopGqlFilter.filtered,
  }

  // 2. prepare data filter
  let filterArrayInStore = dataFilter.tpopfreiwkontr
    ? [...dataFilter.tpopfreiwkontr]
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
      ...merge(singleFilterByHierarchy, singleFilterByParentFiltersForFiltered),
    }
    // add data filter
    const dataFilterObj = { ...filter }
    const filterValues = Object.entries(dataFilterObj).filter(
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
    all: Object.keys(singleFilterForAll).length
      ? singleFilterForAll
      : { or: [] },
    filtered: { or: filterArrayWithoutEmptyObjects },
  }

  return ekfGqlFilter
})

export const treeEkfGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare data filter
  let filterArrayInStore = dataFilter.tpopfreiwkontr
    ? [...dataFilter.tpopfreiwkontr]
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
    const dataFilterObj = { ...filter }
    const filterValues = Object.entries(dataFilterObj).filter(
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

  return ekfGqlFilter
})

export const treeTpopkontrGqlFilterAtom = atom((get) => {
  const ekGqlFilter = get(treeEkGqlFilterAtom)
  const ekfGqlFilter = get(treeEkfGqlFilterAtom)

  return {
    or: [ekGqlFilter?.filtered, ekfGqlFilter.filtered],
  }
})

// Function that returns an atom for beobGqlFilter based on type parameter
export const treeBeobGqlFilterAtom = (
  type: 'nichtBeurteilt' | 'nichtZuzuordnen' | 'zugeordnet',
) =>
  atom((get) => {
    const nodeLabelFilter = get(treeNodeLabelFilterAtom)
    const mapFilter = get(treeMapFilterAtom)
    const tpopGqlFilter = get(treeTpopGqlFilterAtom)

    // 1. prepare hierarchy filter
    const projId = get(treeProjIdInActiveNodeArrayAtom)

    // need list of all open apIds
    const apId = get(treeApIdInActiveNodeArrayAtom)
    const openNodes = get(treeOpenNodesAtom)
    const openApIds = apId
      ? [apId]
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

    const apHiearchyFilter = apId
      ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } }
      : {}
    const projHiearchyFilter = {}
    const singleFilterByHierarchy = merge(apHiearchyFilter, projHiearchyFilter)
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
      tpopByTpopId: tpopGqlFilter.all,
    }
    const singleFilterForAll =
      type === 'zugeordnet'
        ? merge(
            merge(merge(typeFilter, apFilter), singleFilterByHierarchy),
            singleFilterByParentFiltersForAll,
          )
        : merge(typeFilter, apFilter)
    const singleFilterByParentFiltersForFiltered = {
      tpopByTpopId: tpopGqlFilter.filtered,
    }

    // node label filter
    const nodeLabelFilterObj = nodeLabelFilter.beob
      ? {
          label: {
            includesInsensitive: nodeLabelFilter.beob,
          },
        }
      : {}
    // mapFilter
    const mapFilterObj = mapFilter
      ? {
          geomPoint: {
            coveredBy: mapFilter,
          },
        }
      : {}
    let singleFilter = merge(typeFilter, apFilter)
    if (type === 'zugeordnet') {
      singleFilter = merge(singleFilter, singleFilterByHierarchy)
      singleFilter = merge(singleFilter, singleFilterByParentFiltersForFiltered)
    }
    singleFilter = merge(singleFilter, nodeLabelFilterObj)
    singleFilter = merge(singleFilter, mapFilterObj)

    const beobGqlFilter = {
      all: Object.keys(singleFilterForAll).length
        ? singleFilterForAll
        : { or: [] },
      filtered: singleFilter,
    }

    return beobGqlFilter
  })

export const treeBeobNichtBeurteiltGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
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
})

export const treeBeobNichtZuzuordnenGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
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
})

export const treeBeobZugeordnetGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = get(treeNodeLabelFilterAtom)
  const mapFilter = get(treeMapFilterAtom)
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
})

export const treeApFilterAtom = atomWithStorage('apFilter', true, undefined, {
  getOnInit: true,
})
export const treeSetApFilterAtom = atom(
  (get) => null,
  (get, set, val) => {
    set(treeApFilterAtom, val)
  },
)

export const treeMapFilterAtom = atom(undefined)
export const treeSetMapFilterAtom = atom(
  (get) => null,
  (get, set, val) => {
    set(treeMapFilterAtom, val)
  },
)
export const treeEmptyMapFilterAtom = atom(null, (get, set) => {
  set(treeMapFilterAtom, undefined)
})

export const treeMapFilterResetterAtom = atom(0)
export const treeIncrementMapFilterResetterAtom = atom(null, (get, set) => {
  set(treeMapFilterResetterAtom, get(treeMapFilterResetterAtom) + 1)
})

// dataFilter atoms
export const treeDataFilterAtom = atom(initialDataFilterValues)

export const treeDataFilterEmptyTableAtom = atom(
  null,
  (get, set, { table }: { table: string }) => {
    const current = get(treeDataFilterAtom)
    set(treeDataFilterAtom, {
      ...current,
      [table]: initialDataFilterValues[table],
    })
  },
)

export const treeDataFilterEmptyTabAtom = atom(
  null,
  (get, set, { table, activeTab }: { table: string; activeTab: number }) => {
    const current = get(treeDataFilterAtom)
    const tableData = [...current[table]]
    if (tableData.length === 1) {
      const firstElement = { ...tableData[0] }
      Object.keys(firstElement).forEach((key) => (firstElement[key] = null))
      set(treeDataFilterAtom, {
        ...current,
        [table]: [firstElement],
      })
      return
    }
    tableData.splice(activeTab, 1)
    set(treeDataFilterAtom, {
      ...current,
      [table]: tableData,
    })
  },
)

export const treeDataFilterAddOrAtom = atom(
  null,
  (get, set, { table, val }: { table: string; val: any }) => {
    const current = get(treeDataFilterAtom)
    set(treeDataFilterAtom, {
      ...current,
      [table]: [...current[table], val],
    })
  },
)

export const treeDataFilterSetValueAtom = atom(
  null,
  (
    get,
    set,
    {
      table,
      key,
      value,
      index,
    }: { table: string; key: string; value: any; index?: number },
  ) => {
    const current = get(treeDataFilterAtom)
    const tableData = [...current[table]]
    if (index !== undefined) {
      if (!tableData[index]) {
        tableData.push(initialDataFilterValues[table])
      }
      tableData[index] = {
        ...tableData[index],
        [key]: value,
      }
      set(treeDataFilterAtom, {
        ...current,
        [table]: tableData,
      })
      return
    }
    set(treeDataFilterAtom, {
      ...current,
      [table]: {
        ...tableData,
        [key]: value,
      },
    })
  },
)

export const treeDataFilterEmptyAtom = atom(null, (get, set) => {
  set(treeDataFilterAtom, initialDataFilterValues)
})

export const treeActiveFilterTableAtom = atom((get) => {
  const activeNodeArray = get(treeActiveNodeArrayAtom)
  if (activeNodeArray.length > 10) {
    if (activeNodeArray[10] === 'Zaehlungen') return 'tpopkontrzaehl'
  }
  if (activeNodeArray.length > 8) {
    if (activeNodeArray[8] === 'Massnahmen') return 'tpopmassn'
    if (activeNodeArray[8] === 'Freiwilligen-Kontrollen') return 'tpopkontr'
    if (activeNodeArray[8] === 'Feld-Kontrollen') return 'tpopkontr'
    if (activeNodeArray[8] === 'Massnahmen-Berichte') return 'tpopmassnber'
    if (activeNodeArray[8] === 'Kontroll-Berichte') return 'tpopber'
    if (activeNodeArray[8] === 'Beobachtungen') return 'beob'
  }
  if (activeNodeArray.length > 6) {
    if (activeNodeArray[6] === 'Teil-Populationen') return 'tpop'
    if (activeNodeArray[6] === 'Kontroll-Berichte') return 'popber'
    if (activeNodeArray[6] === 'Massnahmen-Berichte') return 'popmassnber'
  }
  if (activeNodeArray.length > 4) {
    if (activeNodeArray[4] === 'Populationen') return 'pop'
    if (activeNodeArray[4] === 'AP-Ziele') return 'ziel'
    if (activeNodeArray[4] === 'AP-Erfolgskriterien') return 'erfkrit'
    if (activeNodeArray[4] === 'AP-Berichte') return 'apber'
    if (activeNodeArray[4] === 'Idealbiotop') return undefined // or pop?
    if (activeNodeArray[4] === 'Taxa') return 'apart'
    if (activeNodeArray[4] === 'assoziierte-Arten') return 'assozart'
    if (activeNodeArray[4] === 'EK-Frequenzen') return 'ekfrequenz'
    if (activeNodeArray[4] === 'EK-Zähleinheiten') return 'ekzaehleinheit'
    if (activeNodeArray[4] === 'nicht-beurteilte-Beobachtungen') return 'beob'
    if (activeNodeArray[4] === 'nicht-zuzuordnende-Beobachtungen') return 'beob'
    if (activeNodeArray[4] === 'Qualitätskontrollen') return undefined
    if (activeNodeArray[4] === 'Qualitätskontrollen-wählen') return undefined
  }
  if (activeNodeArray.length > 2) {
    if (activeNodeArray[2] === 'Arten') return 'ap'
    if (activeNodeArray[2] === 'AP-Berichte') return 'apberuebersicht'
  }
  if (activeNodeArray.length > 1) {
    if (activeNodeArray[1] === 'Adressen') return 'adresse'
    if (activeNodeArray[1] === 'ApberrelevantGrundWerte')
      return 'tpopApberrelevantGrundWerte'
    if (activeNodeArray[1] === 'EkAbrechnungstypWerte')
      return 'ekAbrechnungstypWerte'
    if (activeNodeArray[1] === 'TpopkontrzaehlEinheitWerte')
      return 'tpopkontrzaehlEinheitWerte'
  }
  if (activeNodeArray[0] === 'Benutzer') return 'user'
  if (activeNodeArray[0] === 'Dokumentation') return 'doc'
  return undefined
})
export const treeSetActiveNodeArrayAtom = atom(
  (get) => get(treeActiveNodeArrayAtom),
  (get, set, val) => {
    if (isEqual(val, get(treeActiveNodeArrayAtom))) {
      // do not do this if already set
      // trying to stop vicious cycle of reloading in first start after update
      return
    }
    // always set missing open nodes
    const extraOpenNodes = []
    val.forEach((v, i) => {
      extraOpenNodes.push(val.slice(0, i + 1))
    })
    set(treeAddOpenNodesAtom, extraOpenNodes)

    set(treeActiveNodeArrayAtom, val)
  },
)

export const newTpopFromBeobDialogOpenAtom = atomWithStorage(
  'newTpopFromBeobDialogOpen',
  false,
)
export const newTpopFromBeobBeobIdAtom = atomWithStorage(
  'newTpopFromBeobBeobId',
  null,
)

export const enforceDesktopNavigationAtom = atomWithStorage(
  'enforceDesktopNavigation',
  false,
)
export const writeEnforceDesktopNavigationAtom = atom(
  (get) => get(enforceDesktopNavigationAtom),
  (get, set, enforce) => {
    if (enforce) {
      set(enforceDesktopNavigationAtom, true)
      set(enforceMobileNavigationAtom, false)
      set(isDesktopViewAtom, true)
      return
    }
    set(enforceDesktopNavigationAtom, false)
    const isNowDesktopView = window.innerWidth >= constants.mobileViewMaxWidth
    set(isDesktopViewAtom, isNowDesktopView)
    return
  },
)
export const enforceMobileNavigationAtom = atomWithStorage(
  'enforceMobileNavigation',
  false,
)
export const writeEnforceMobileNavigationAtom = atom(
  (get) => get(enforceMobileNavigationAtom),
  (get, set, enforce) => {
    if (enforce) {
      set(enforceMobileNavigationAtom, true)
      set(enforceDesktopNavigationAtom, false)
      set(isDesktopViewAtom, false)
      return
    }
    set(enforceMobileNavigationAtom, false)
    const isNowDesktopView = window.innerWidth >= constants.mobileViewMaxWidth
    set(isDesktopViewAtom, isNowDesktopView)
    return
  },
)
export const isDesktopViewAtom = atomWithStorage('isDesktopView', false)
export const setDesktopViewAtom = atom(
  (get) => get(isDesktopViewAtom),
  (get, set, width) => {
    if (typeof width !== 'number') return
    const isDesktopView = get(isDesktopViewAtom)
    const mobileEnforced = get(enforceMobileNavigationAtom)
    const desktopEnforced = get(enforceDesktopNavigationAtom)
    if (mobileEnforced) {
      if (isDesktopView) set(isDesktopViewAtom, false)
      return
    }
    if (desktopEnforced) {
      if (!isDesktopView) set(isDesktopViewAtom, true)
      return
    }
    const isNowDesktopView = width >= constants.mobileViewMaxWidth
    if (isNowDesktopView === isDesktopView) return
    set(isDesktopViewAtom, isNowDesktopView)
  },
)

export const isMobileViewAtom = atom(
  (get) => !get(isDesktopViewAtom) || get(enforceMobileNavigationAtom),
)
export const hideBookmarksAtom = atom((get) => {
  const isDesktopView = get(isDesktopViewAtom)
  const enforceMobileNavigation = get(enforceMobileNavigationAtom)
  const hideBookmarks = isDesktopView && !enforceMobileNavigation
  return hideBookmarks
})
export const showBookmarksMenuAtom = atomWithStorage('showBookmarksMenu', false)
export const alwaysShowTreeAtom = atomWithStorage('alwaysShowTree', false)
export const hideTreeAtom = atom((get) => {
  const alwaysShowTree = get(alwaysShowTreeAtom)
  const isMobileView = get(isMobileViewAtom)
  const hideTree = !alwaysShowTree && isMobileView
  return hideTree
})
// lets not save this in storage - is only used while printing
export const mapHideControlsAtom = atom(false)
export const setMapHideControlsAtom = atom(
  (get) => get(mapHideControlsAtom),
  (get, set, value) => set(mapHideControlsAtom, value),
)
export const mapMouseCoordinatesAtom = atom({ x: 2683000, y: 1247500 })
export const setMapMouseCoordinatesAtom = atom(
  (get) => get(mapMouseCoordinatesAtom),
  (get, set, { x, y }) => set(mapMouseCoordinatesAtom, { x, y }),
)
// setting bounds works imperatively with map.fitBounds since v3
// but keeping bounds in store as last used bounds will be re-applied on next map opening
export const mapBoundsAtom = atomWithStorage('mapBounds', [
  [47.159, 8.354],
  [47.696, 8.984],
])
export const setMapBoundsAtom = atom(
  (get) => get(mapBoundsAtom),
  (get, set, value) => set(mapBoundsAtom, value),
)
export const idOfTpopBeingLocalizedAtom = atom<string | null>(null)
export const setIdOfTpopBeingLocalizedAtom = atom(
  (get) => get(idOfTpopBeingLocalizedAtom),
  (get, set, value) => set(idOfTpopBeingLocalizedAtom, value),
)
export const mapShowApfLayersForMultipleApsAtom = atomWithStorage(
  'mapShowApfLayersForMultipleAps',
  false,
)
export const setMapShowApfLayersForMultipleApsAtom = atom(
  (get) => get(mapShowApfLayersForMultipleApsAtom),
  (get, set, value) => set(mapShowApfLayersForMultipleApsAtom, value),
)
// make this a regular atom so we can change the default value
export const mapOverlaysAtom = atom([
  { label: 'Markierungen', value: 'Markierungen' },
  { label: 'Detailpläne', value: 'Detailplaene' },
  {
    label: 'Massnahmenpläne der aktiven Art, Flächen',
    value: 'MassnahmenFlaechen',
  },
  {
    label: 'Massnahmenpläne der aktiven Art, Linien',
    value: 'MassnahmenLinien',
  },
  {
    label: 'Massnahmenpläne der aktiven Art, Punkte',
    value: 'MassnahmenPunkte',
  },
  { label: 'NS-Gebiete Betreuung', value: 'Betreuungsgebiete' },
  { label: 'ZH Übersichtsplan', value: 'ZhUep' },
  { label: 'Gemeinden', value: 'Gemeinden' },
  { label: 'SVO grau', value: 'ZhSvoGrey' },
  { label: 'SVO farbig', value: 'ZhSvoColor' },
  { label: 'Pflegeplan', value: 'ZhPflegeplan' },
  {
    label: 'Lebensraum- und Vegetationskartierungen',
    value: 'ZhLrVegKartierungen',
  },
  { label: 'Wälder: lichte', value: 'ZhLichteWaelder' },
  { label: 'Wälder: Vegetation', value: 'ZhWaelderVegetation' },
  { label: 'Forstreviere (WMS)', value: 'ZhForstreviereWms' },
  { label: 'Forstreviere. Stand: 2025.04.10', value: 'Forstreviere' },
])
export const setMapOverlaysAtom = atom(
  (get) => get(mapOverlaysAtom),
  (get, set, value) => set(mapOverlaysAtom, value),
)
export const mapActiveOverlaysAtom = atomWithStorage('mapActiveOverlays', [])
export const setMapActiveOverlaysAtom = atom(
  (get) => get(mapActiveOverlaysAtom),
  (get, set, value) => set(mapActiveOverlaysAtom, value),
)
export const mapActiveBaseLayerAtom = atomWithStorage(
  'mapActiveBaseLayer',
  'OsmColor',
)
export const setMapActiveBaseLayerAtom = atom(
  (get) => get(mapActiveBaseLayerAtom),
  (get, set, value) => set(mapActiveBaseLayerAtom, value),
)
export const mapPopIconAtom = atomWithStorage(
  'mapPopIcon',
  'statusGroupSymbols',
)
export const setMapPopIconAtom = atom(
  (get) => get(mapPopIconAtom),
  (get, set, value) => set(mapPopIconAtom, value),
)
export const mapTpopIconAtom = atomWithStorage(
  'mapTpopIcon',
  'statusGroupSymbols',
)
export const setMapTpopIconAtom = atom(
  (get) => get(mapTpopIconAtom),
  (get, set, value) => set(mapTpopIconAtom, value),
)
export const mapPopLabelAtom = atomWithStorage('mapPopLabel', 'nr')
export const setMapPopLabelAtom = atom(
  (get) => get(mapPopLabelAtom),
  (get, set, value) => set(mapPopLabelAtom, value),
)
export const mapTpopLabelAtom = atomWithStorage('mapTpopLabel', 'nr')
export const setMapTpopLabelAtom = atom(
  (get) => get(mapTpopLabelAtom),
  (get, set, value) => set(mapTpopLabelAtom, value),
)
export const mapBeobDetailsOpenAtom = atom(false)
export const setMapBeobDetailsOpenAtom = atom(
  (get) => get(mapBeobDetailsOpenAtom),
  (get, set, value) => set(mapBeobDetailsOpenAtom, value),
)

// used to open tree2 on a specific activeNodeArray
export const tree2SrcAtom = atom('')
export const resetTree2SrcAtom = atom(null, (get, set) => {
  set(tree2SrcAtom, '')
})
export const setTree2SrcByActiveNodeArrayAtom = atom(
  null,
  (get, set, { activeNodeArray, search, onlyShowActivePath }) => {
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
    if (onlyShowActivePath) {
      iFrameSearch.onlyShowActivePath = true
    }
    const newSearch = queryString.stringify(iFrameSearch)
    // pass this via src to iframe
    const iFrameSrc = `${appBaseUrl().slice(
      0,
      -1,
    )}${`/Daten/${activeNodeArray.join('/')}`}?${newSearch}`
    set(tree2SrcAtom, iFrameSrc)
  },
)

// treeLastTouchedNode - tracks the last touched tree node for scrolling
export const treeLastTouchedNodeAtom = atom([])
export const setTreeLastTouchedNodeAtom = atom(
  (get) => get(treeLastTouchedNodeAtom),
  (get, set, value) => set(treeLastTouchedNodeAtom, value),
)

// treeShowPopIcon - controls whether to show pop icons in tree
export const treeShowPopIconAtom = atomWithStorage('treeShowPopIcon', true)
export const toggleTreeShowPopIconAtom = atom(
  (get) => get(treeShowPopIconAtom),
  (get, set) => set(treeShowPopIconAtom, !get(treeShowPopIconAtom)),
)
export const setTreeShowPopIconAtom = atom(
  (get) => get(treeShowPopIconAtom),
  (get, set, value) => set(treeShowPopIconAtom, value),
)

// treeShowTpopIcon - controls whether to show tpop icons in tree
export const treeShowTpopIconAtom = atomWithStorage('treeShowTpopIcon', true)
export const toggleTreeShowTpopIconAtom = atom(
  (get) => get(treeShowTpopIconAtom),
  (get, set) => set(treeShowTpopIconAtom, !get(treeShowTpopIconAtom)),
)
export const setTreeShowTpopIconAtom = atom(
  (get) => get(treeShowTpopIconAtom),
  (get, set, value) => set(treeShowTpopIconAtom, value),
)

// treeNodeLabelFilter - stores filter values for tree node labels
export const treeNodeLabelFilterAtom = atomWithStorage('treeNodeLabelFilter', {
  ap: null,
  pop: null,
  tpop: null,
  tpopkontr: null,
  tpopfeldkontr: null,
  tpopfreiwkontr: null,
  tpopkontrzaehl: null,
  tpopmassn: null,
  ziel: null,
  erfkrit: null,
  apber: null,
  apberuebersicht: null,
  idealbiotop: null,
  assozart: null,
  ekzaehleinheit: null,
  ekfrequenz: null,
  popber: null,
  popmassnber: null,
  tpopber: null,
  tpopmassnber: null,
  apart: null,
  projekt: null,
  beob: null,
  beobprojekt: null,
  adresse: null,
  gemeinde: null,
  user: null,
  ekAbrechnungstypWerte: null,
  tpopApberrelevantGrundWerte: null,
  tpopkontrzaehlEinheitWerte: null,
  doc: '',
})

export const treeSetNodeLabelFilterKeyAtom = atom(
  (get) => null,
  (get, set, { key, value }) => {
    const current = get(treeNodeLabelFilterAtom)
    // only write if changed
    if (current[key] !== value) {
      set(treeNodeLabelFilterAtom, { ...current, [key]: value })
    }
  },
)

export const treeEmptyNodeLabelFilterAtom = atom(
  (get) => null,
  (get, set) => {
    set(treeNodeLabelFilterAtom, {
      ap: null,
      pop: null,
      tpop: null,
      tpopkontr: null,
      tpopfeldkontr: null,
      tpopfreiwkontr: null,
      tpopkontrzaehl: null,
      tpopmassn: null,
      ziel: null,
      erfkrit: null,
      apber: null,
      apberuebersicht: null,
      idealbiotop: null,
      assozart: null,
      ekzaehleinheit: null,
      ekfrequenz: null,
      popber: null,
      popmassnber: null,
      tpopber: null,
      tpopmassnber: null,
      apart: null,
      projekt: null,
      beob: null,
      beobprojekt: null,
      adresse: null,
      gemeinde: null,
      user: null,
      ekAbrechnungstypWerte: null,
      tpopApberrelevantGrundWerte: null,
      tpopkontrzaehlEinheitWerte: null,
      doc: '',
    })
  },
)

export const treeResetNodeLabelFilterKeepingApAtom = atom(
  (get) => null,
  (get, set) => {
    const current = get(treeNodeLabelFilterAtom)
    set(treeNodeLabelFilterAtom, {
      ap: current.ap,
      pop: null,
      tpop: null,
      tpopkontr: null,
      tpopfeldkontr: null,
      tpopfreiwkontr: null,
      tpopkontrzaehl: null,
      tpopmassn: null,
      ziel: null,
      erfkrit: null,
      apber: null,
      apberuebersicht: null,
      idealbiotop: null,
      assozart: null,
      ekzaehleinheit: null,
      ekfrequenz: null,
      popber: null,
      popmassnber: null,
      tpopber: null,
      tpopmassnber: null,
      apart: null,
      projekt: null,
      beob: null,
      beobprojekt: null,
      adresse: null,
      gemeinde: null,
      user: null,
      ekAbrechnungstypWerte: null,
      tpopApberrelevantGrundWerte: null,
      tpopkontrzaehlEinheitWerte: null,
      doc: '',
    })
  },
)

// apfloraLayers is not stored - needs to update when code changes
export const mapApfloraLayersAtom = atom([
  { label: 'Populationen', value: 'pop' },
  { label: 'Teil-Populationen', value: 'tpop' },
  { label: 'Beobachtungen: zugeordnet', value: 'beobZugeordnet' },
  { label: 'Beobachtungen: nicht beurteilt', value: 'beobNichtBeurteilt' },
  { label: 'Beobachtungen: nicht zuzuordnen', value: 'beobNichtZuzuordnen' },
  { label: 'Zuordnungs-Linien', value: 'beobZugeordnetAssignPolylines' },
])
export const mapActiveApfloraLayersAtom = atomWithStorage<string[]>(
  'activeApfloraLayers',
  [],
)
export const setMapActiveApfloraLayersAtom = atom(
  (get) => get(mapActiveApfloraLayersAtom),
  (get, set, value) => set(mapActiveApfloraLayersAtom, value),
)
export const showTreeMenusAtom = atom((get) => {
  // always show tree menus on desktop
  const isDesktopView = get(isDesktopViewAtom)
  // always show tree menus on mobile if alwaysShowTree is set
  const alwaysShowTree = get(alwaysShowTreeAtom)
  // always show tree menus if context menus are hidden i.e. on coarse pointer devices. NOPE
  // const contextMenusAreHidden = matchMedia('(pointer: coarse)').matches
  const showTreeMenus = isDesktopView || alwaysShowTree

  return showTreeMenus
})

export const adresseNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'adresseNavListFilterIsVisible',
  false,
)
export const apNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'apNavListFilterIsVisible',
  false,
)
export const apartNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'apartNavListFilterIsVisible',
  false,
)
export const apberNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'apberNavListFilterIsVisible',
  false,
)
export const apberuebersichtNavListFilterIsVisibleAtom =
  atomWithToggleAndStorage('apberuebersichtNavListFilterIsVisible', false)
export const aperfkritNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'aprefkritNavListFilterIsVisible',
  false,
)
export const apzielNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'apzielNavListFilterIsVisible',
  false,
)
export const apzielberNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'apzielberNavListFilterIsVisible',
  false,
)
export const assozartNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'assozartNavListFilterIsVisible',
  false,
)
export const beobNichtBeurteiltNavListFilterIsVisibleAtom =
  atomWithToggleAndStorage('beobNichtBeurteiltNavListFilterIsVisible', false)
export const beobNichtZuzuordnenNavListFilterIsVisibleAtom =
  atomWithToggleAndStorage('beobNichtZuzuordnenNavListFilterIsVisible', false)
export const beobZugeordnetNavListFilterIsVisibleAtom =
  atomWithToggleAndStorage('beobZugeordnetNavListFilterIsVisible', false)
export const ekAbrechnungstypWerteNavListFilterIsVisibleAtom =
  atomWithToggleAndStorage('ekAbrechnungstypWerteNavListFilterIsVisible', false)
export const ekfrequenzNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'ekfrequenzNavListFilterIsVisible',
  false,
)
export const ekzaehleinheitNavListFilterIsVisibleAtom =
  atomWithToggleAndStorage('ekzaehleinheitNavListFilterIsVisible', false)
export const erfkritNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'erfkritNavListFilterIsVisible',
  false,
)
export const popNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'popNavListFilterIsVisible',
  false,
)
export const popberNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'popberNavListFilterIsVisible',
  false,
)
export const popmassnberNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'popmassnberNavListFilterIsVisible',
  false,
)
export const tpopNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'tpopNavListFilterIsVisible',
  false,
)
export const tpopApberrelevantGrundWerteNavListFilterIsVisibleAtom =
  atomWithToggleAndStorage(
    'tpopApberrelevantGrundWerteNavListFilterIsVisible',
    false,
  )
export const tpopberNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'tpopberNavListFilterIsVisible',
  false,
)
export const tpopkontrNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'tpopkontrNavListFilterIsVisible',
  false,
)
export const tpopkontrzaehlNavListFilterIsVisibleAtom =
  atomWithToggleAndStorage('tpopkontrzaehlNavListFilterIsVisible', false)
export const tpopkontrzaehlEinheitWerteNavListFilterIsVisibleAtom =
  atomWithToggleAndStorage(
    'tpopkontrzaehlEinheitWerteNavListFilterIsVisible',
    false,
  )
export const tpopmassnNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'tpopmassnNavListFilterIsVisible',
  false,
)
export const tpopmassnberNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'tpopmassnberNavListFilterIsVisible',
  false,
)
export const userNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'userNavListFilterIsVisible',
  false,
)
export const zielNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'zielNavListFilterIsVisible',
  false,
)
export const docNavListFilterIsVisibleAtom = atomWithToggleAndStorage(
  'docNavListFilterIsVisible',
  false,
)

export const navListFilterAtoms = {
  adresse: adresseNavListFilterIsVisibleAtom,
  ap: apNavListFilterIsVisibleAtom,
  apart: apartNavListFilterIsVisibleAtom,
  apber: apberNavListFilterIsVisibleAtom,
  apberuebersicht: apberuebersichtNavListFilterIsVisibleAtom,
  aperfkrit: aperfkritNavListFilterIsVisibleAtom,
  apziel: apzielNavListFilterIsVisibleAtom,
  apzielber: apzielberNavListFilterIsVisibleAtom,
  assozart: assozartNavListFilterIsVisibleAtom,
  beobNichtBeurteilt: beobNichtBeurteiltNavListFilterIsVisibleAtom,
  beobNichtZuzuordnen: beobNichtZuzuordnenNavListFilterIsVisibleAtom,
  beobZugeordnet: beobZugeordnetNavListFilterIsVisibleAtom,
  ekAbrechnungstypWerte: ekAbrechnungstypWerteNavListFilterIsVisibleAtom,
  ekfrequenz: ekfrequenzNavListFilterIsVisibleAtom,
  ekzaehleinheit: ekzaehleinheitNavListFilterIsVisibleAtom,
  erfkrit: erfkritNavListFilterIsVisibleAtom,
  pop: popNavListFilterIsVisibleAtom,
  popber: popberNavListFilterIsVisibleAtom,
  popmassnber: popmassnberNavListFilterIsVisibleAtom,
  tpop: tpopNavListFilterIsVisibleAtom,
  tpopApberrelevantGrundWerte:
    tpopApberrelevantGrundWerteNavListFilterIsVisibleAtom,
  tpopber: tpopberNavListFilterIsVisibleAtom,
  tpopkontr: tpopkontrNavListFilterIsVisibleAtom,
  tpopkontrzaehl: tpopkontrzaehlNavListFilterIsVisibleAtom,
  tpopkontrzaehlEinheitWerte:
    tpopkontrzaehlEinheitWerteNavListFilterIsVisibleAtom,
  tpopmassn: tpopmassnNavListFilterIsVisibleAtom,
  tpopmassnber: tpopmassnberNavListFilterIsVisibleAtom,
  user: userNavListFilterIsVisibleAtom,
  ziel: zielNavListFilterIsVisibleAtom,
  doc: docNavListFilterIsVisibleAtom,
  // needed because the hook can't be called conditionally
  // and an atom always needs to be returned
  undefined: adresseNavListFilterIsVisibleAtom,
}

export const tsQueryClientAtom = atom(null)
export const apolloClientAtom = atom(null)

// Notifications
export const notificationsAtom = atom([])

export const addNotificationAtom = atom(null, (get, set, note) => {
  const notifications = get(notificationsAtom)
  const key = note.options?.key ?? new Date().getTime() + Math.random()
  set(notificationsAtom, [
    ...notifications,
    {
      key,
      ...note,
    },
  ])
})

export const removeNotificationAtom = atom(null, (get, set, key) => {
  const notifications = get(notificationsAtom)
  set(
    notificationsAtom,
    notifications.filter((n) => n.key !== key),
  )
})

// navigate function atom
// Store as object because Jotai doesn't handle bare functions well
// The setter accepts a function and wraps it in { fn: function }
const navigateObjectBaseAtom = atom(undefined)
export const navigateObjectAtom = atom(
  (get) => get(navigateObjectBaseAtom),
  (get, set, navigateFunction) => {
    set(navigateObjectBaseAtom, { fn: navigateFunction })
  },
)
export const navigateAtom = atom((get) => get(navigateObjectBaseAtom)?.fn)

// Assigning Beob
export const assigningBeobAtom = atom(false)
export const setAssigningBeobAtom = atom(null, (get, set, val) => {
  set(assigningBeobAtom, val)
})

// Choose AP dialogs
export const openChooseApToCopyEkfrequenzsFromAtom = atom(false)
export const setOpenChooseApToCopyEkfrequenzsFromAtom = atom(
  null,
  (get, set, val) => {
    set(openChooseApToCopyEkfrequenzsFromAtom, val)
  },
)
export const openChooseApToCopyErfkritsFromAtom = atom(false)
export const setOpenChooseApToCopyErfkritsFromAtom = atom(
  null,
  (get, set, val) => {
    set(openChooseApToCopyErfkritsFromAtom, val)
  },
)

// Print state
export const isPrintAtom = atom(false)
export const setIsPrintAtom = atom(null, (get, set, val) => {
  set(isPrintAtom, val)
})
export const isEkfSinglePrintAtom = atom(false)
export const setIsEkfSinglePrintAtom = atom(null, (get, set, val) => {
  set(isEkfSinglePrintAtom, val)
})

// User
export const userAtom = atomWithStorage('user', {
  name: '',
  token: null,
  id: null,
})

export const userNameAtom = atom((get) => get(userAtom).name)
export const userTokenAtom = atom((get) => get(userAtom).token)

export const removeUserAtom = atom(null, (get, set) => {
  set(userAtom, {
    name: '',
    token: null,
    id: null,
  })
})

// Copying
export const copyingAtom = atom({
  table: null,
  id: null,
  label: null,
  withNextLevel: false,
})

export const setCopyingAtom = atom(
  null,
  (get, set, { table, id, label, withNextLevel }) => {
    set(copyingAtom, { table, id, label, withNextLevel })
  },
)

export const copyingBiotopAtom = atom({
  id: null,
  label: null,
})

export const setCopyingBiotopAtom = atom(null, (get, set, { id, label }) => {
  set(copyingBiotopAtom, { id, label })
})

export const movingAtom = atom({
  table: null,
  id: null,
  label: null,
  toTable: null,
  fromParentId: null,
})

export const setMovingAtom = atom(
  null,
  (get, set, { table, id, label, toTable, fromParentId }) => {
    set(movingAtom, { table, id, label, toTable, fromParentId })
  },
)

export const clearAllStorageAtom = atom(null, (get, set) => {
  // Reset user
  set(userAtom, { name: '', token: null, id: null })

  // Reset dialog state
  set(newTpopFromBeobDialogOpenAtom, false)
  set(newTpopFromBeobBeobIdAtom, null)

  // Reset navigation state
  set(enforceDesktopNavigationAtom, false)
  set(enforceMobileNavigationAtom, false)
  set(isDesktopViewAtom, false)
  set(showBookmarksMenuAtom, false)
  set(alwaysShowTreeAtom, false)

  // Reset all nav list filters
  set(adresseNavListFilterIsVisibleAtom, false)
  set(apNavListFilterIsVisibleAtom, false)
  set(apartNavListFilterIsVisibleAtom, false)
  set(apberNavListFilterIsVisibleAtom, false)
  set(apberuebersichtNavListFilterIsVisibleAtom, false)
  set(aperfkritNavListFilterIsVisibleAtom, false)
  set(apzielNavListFilterIsVisibleAtom, false)
  set(apzielberNavListFilterIsVisibleAtom, false)
  set(assozartNavListFilterIsVisibleAtom, false)
  set(beobNichtBeurteiltNavListFilterIsVisibleAtom, false)
  set(beobNichtZuzuordnenNavListFilterIsVisibleAtom, false)
  set(beobZugeordnetNavListFilterIsVisibleAtom, false)
  set(ekAbrechnungstypWerteNavListFilterIsVisibleAtom, false)
  set(ekfrequenzNavListFilterIsVisibleAtom, false)
  set(ekzaehleinheitNavListFilterIsVisibleAtom, false)
  set(erfkritNavListFilterIsVisibleAtom, false)
  set(popNavListFilterIsVisibleAtom, false)
  set(popberNavListFilterIsVisibleAtom, false)
  set(popmassnberNavListFilterIsVisibleAtom, false)
  set(tpopNavListFilterIsVisibleAtom, false)
  set(tpopApberrelevantGrundWerteNavListFilterIsVisibleAtom, false)
  set(tpopberNavListFilterIsVisibleAtom, false)
  set(tpopkontrNavListFilterIsVisibleAtom, false)
  set(tpopkontrzaehlNavListFilterIsVisibleAtom, false)
  set(tpopkontrzaehlEinheitWerteNavListFilterIsVisibleAtom, false)
  set(tpopmassnNavListFilterIsVisibleAtom, false)
  set(tpopmassnberNavListFilterIsVisibleAtom, false)
  set(userNavListFilterIsVisibleAtom, false)
  set(zielNavListFilterIsVisibleAtom, false)
  set(docNavListFilterIsVisibleAtom, false)

  // Reset copying state
  set(copyingAtom, {
    table: null,
    id: null,
    label: null,
    withNextLevel: false,
  })
  set(copyingBiotopAtom, {
    id: null,
    label: null,
  })

  // Reset moving state
  set(movingAtom, {
    table: null,
    id: null,
    label: null,
    toTable: null,
    fromParentId: null,
  })
})

// toDelete atom and actions
export const toDeleteAtom = atom({
  table: null,
  id: null,
  label: null,
  url: null,
  afterDeletionHook: null,
})

export const setToDeleteAtom = atom(
  (get) => get(toDeleteAtom),
  (get, set, { table, id, label, url, afterDeletionHook }) => {
    set(toDeleteAtom, {
      table,
      id,
      label,
      // without slicing deleting ekzaehleinheit errored
      url: url ? url.slice() : null,
      afterDeletionHook,
    })
  },
)

export const emptyToDeleteAtom = atom(
  (get) => get(toDeleteAtom),
  (get, set) => {
    set(toDeleteAtom, {
      table: null,
      id: null,
      label: null,
      url: null,
      afterDeletionHook: null,
    })
  },
)

// deletedDatasets atom and actions
export const deletedDatasetsAtom = atom([])

export const setDeletedDatasetsAtom = atom(
  (get) => get(deletedDatasetsAtom),
  (get, set, val) => {
    set(deletedDatasetsAtom, val)
  },
)

export const addDeletedDatasetAtom = atom(
  (get) => get(deletedDatasetsAtom),
  (get, set, val) => {
    const current = get(deletedDatasetsAtom)
    set(deletedDatasetsAtom, [...current, val])
  },
)

export const removeDeletedDatasetByIdAtom = atom(
  (get) => get(deletedDatasetsAtom),
  (get, set, id) => {
    const current = get(deletedDatasetsAtom)
    set(
      deletedDatasetsAtom,
      current.filter((d) => d.id !== id),
    )
  },
)

// showDeletions atom and actions
export const showDeletionsAtom = atom(false)

export const setShowDeletionsAtom = atom(
  (get) => get(showDeletionsAtom),
  (get, set, val) => {
    set(showDeletionsAtom, val)
  },
)

// EkPlan atoms
export const ekPlanShowEkAtom = atom(true)
export const ekPlanShowEkfAtom = atom(true)
export const ekPlanShowCountAtom = atom(true)
export const ekPlanShowEkCountAtom = atom(true)
export const ekPlanShowMassnAtom = atom(true)

export const ekPlanSetShowEkAtom = atom(null, (get, set, val) => {
  set(ekPlanShowEkAtom, val)
})
export const ekPlanSetShowEkfAtom = atom(null, (get, set, val) => {
  set(ekPlanShowEkfAtom, val)
})
export const ekPlanSetShowCountAtom = atom(null, (get, set, val) => {
  set(ekPlanShowCountAtom, val)
})
export const ekPlanSetShowEkCountAtom = atom(null, (get, set, val) => {
  set(ekPlanShowEkCountAtom, val)
})
export const ekPlanSetShowMassnAtom = atom(null, (get, set, val) => {
  set(ekPlanShowMassnAtom, val)
})

// EkPlan aps
export const ekPlanApsAtom = atomWithStorage('ekPlanAps', [])
export const ekPlanApValuesAtom = atom((get) => {
  const aps = get(ekPlanApsAtom)
  return aps.map((a) => a.value)
})
export const ekPlanAddApAtom = atom(null, (get, set, ap) => {
  const current = get(ekPlanApsAtom)
  set(ekPlanApsAtom, [...current, ap])
})
export const ekPlanRemoveApAtom = atom(null, (get, set, ap) => {
  const current = get(ekPlanApsAtom)
  set(
    ekPlanApsAtom,
    current.filter((a) => a.value !== ap.value),
  )
})

// EkPlan fields
const defaultFields = [
  'ap',
  'popNr',
  'nr',
  'ekfrequenz',
  'ekfrequenzStartjahr',
  'ekfrequenzAbweichend',
]
export const ekPlanFieldsAtom = atom(defaultFields)
export const ekPlanSetFieldsAtom = atom(null, (get, set, fields) => {
  set(ekPlanFieldsAtom, fields)
})
export const ekPlanToggleFieldAtom = atom(null, (get, set, field) => {
  const current = get(ekPlanFieldsAtom)
  if (current.includes(field)) {
    set(
      ekPlanFieldsAtom,
      current.filter((f) => f !== field),
    )
  } else {
    const unique = [...new Set([...current, field])]
    set(ekPlanFieldsAtom, unique)
  }
})
export const ekPlanAddFieldAtom = atom(null, (get, set, field) => {
  const current = get(ekPlanFieldsAtom)
  const unique = [...new Set([...current, field])]
  set(ekPlanFieldsAtom, unique)
})
export const ekPlanRemoveFieldAtom = atom(null, (get, set, field) => {
  const current = get(ekPlanFieldsAtom)
  set(
    ekPlanFieldsAtom,
    current.filter((f) => f !== field),
  )
})

// EkPlan hovered
export const ekPlanHoveredAtom = atom({ year: null, tpopId: null })
export const ekPlanSetHoveredAtom = atom(null, (get, set, val) => {
  set(ekPlanHoveredAtom, val)
})
export const ekPlanSetHoveredYearAtom = atom(null, (get, set, val) => {
  const current = get(ekPlanHoveredAtom)
  set(ekPlanHoveredAtom, { ...current, year: val })
})
export const ekPlanSetHoveredTpopIdAtom = atom(null, (get, set, val) => {
  const current = get(ekPlanHoveredAtom)
  set(ekPlanHoveredAtom, { ...current, tpopId: val })
})
export const ekPlanResetHoveredAtom = atom(null, (get, set) => {
  set(ekPlanHoveredAtom, { year: null, tpopId: null })
})

// EkPlan data loading
export const ekPlanApsDataLoadingAtom = atom(true)
export const ekPlanSetApsDataLoadingAtom = atom(null, (get, set, val) => {
  set(ekPlanApsDataLoadingAtom, val)
})

// EkPlan filters
export const ekPlanFilterApAtom = atom(null)
export const ekPlanFilterPopNrAtom = atom(null)
export const ekPlanFilterPopNameAtom = atom(null)
export const ekPlanFilterPopStatusAtom = atom([100, 101, 200, 201, 202, 300])
export const ekPlanFilterNrAtom = atom(null)
export const ekPlanFilterGemeindeAtom = atom(null)
export const ekPlanFilterFlurnameAtom = atom(null)
export const ekPlanFilterStatusAtom = atom([100, 101, 200, 201, 202, 300])
export const ekPlanFilterBekanntSeitAtom = atom(null)
export const ekPlanFilterLv95XAtom = atom(null)
export const ekPlanFilterLv95YAtom = atom(null)
export const ekPlanFilterEkfKontrolleurAtom = atom(null)
export const ekPlanFilterEkAbrechnungstypAtom = atom(null)
export const ekPlanFilterEkfrequenzAtom = atom(null)
export const ekPlanFilterEkfrequenzStartjahrAtom = atom(null)
export const ekPlanFilterEkfrequenzAbweichendAtom = atom(false)
export const ekPlanFilterEkfrequenzEmptyAtom = atom(false)
export const ekPlanFilterEkfrequenzStartjahrEmptyAtom = atom(false)
export const ekPlanFilterAnsiedlungYearAtom = atom(null)
export const ekPlanFilterKontrolleYearAtom = atom(null)
export const ekPlanFilterEkplanYearAtom = atom(null)

export const ekPlanSetFilterApAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterApAtom, val)
})
export const ekPlanSetFilterPopNrAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterPopNrAtom, val ? +val : null)
})
export const ekPlanSetFilterPopNameAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterPopNameAtom, val)
})
export const ekPlanSetFilterPopStatusAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterPopStatusAtom, val || [100, 101, 200, 201, 202, 300])
})
export const ekPlanSetFilterNrAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterNrAtom, val ? +val : null)
})
export const ekPlanSetFilterGemeindeAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterGemeindeAtom, val)
})
export const ekPlanSetFilterFlurnameAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterFlurnameAtom, val)
})
export const ekPlanSetFilterStatusAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterStatusAtom, val || [100, 101, 200, 201, 202, 300])
})
export const ekPlanSetFilterBekanntSeitAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterBekanntSeitAtom, val ? +val : null)
})
export const ekPlanSetFilterLv95XAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterLv95XAtom, val ? +val : null)
})
export const ekPlanSetFilterLv95YAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterLv95YAtom, val ? +val : null)
})
export const ekPlanSetFilterEkfKontrolleurAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterEkfKontrolleurAtom, val)
})
export const ekPlanSetFilterEkAbrechnungstypAtom = atom(
  null,
  (get, set, val) => {
    set(ekPlanFilterEkAbrechnungstypAtom, val)
  },
)
export const ekPlanSetFilterEkfrequenzAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterEkfrequenzAtom, val)
})
export const ekPlanSetFilterEkfrequenzStartjahrAtom = atom(
  null,
  (get, set, val) => {
    set(ekPlanFilterEkfrequenzStartjahrAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterEkfrequenzAbweichendAtom = atom(
  null,
  (get, set, val) => {
    set(ekPlanFilterEkfrequenzAbweichendAtom, val)
  },
)
export const ekPlanSetFilterEmptyEkfrequenzAtom = atom(
  null,
  (get, set, val) => {
    set(ekPlanFilterEkfrequenzEmptyAtom, val)
  },
)
export const ekPlanSetFilterAnsiedlungYearAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterAnsiedlungYearAtom, val)
})
export const ekPlanSetFilterKontrolleYearAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterKontrolleYearAtom, val)
})
export const ekPlanSetFilterEkplanYearAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterEkplanYearAtom, val)
})
export const ekPlanSetFilterEmptyEkfrequenzStartjahrAtom = atom(
  null,
  (get, set, val) => {
    set(ekPlanFilterEkfrequenzStartjahrEmptyAtom, val)
  },
)

// EkPlan pastYears
export const ekPlanPastYearsAtom = atom(5)
export const ekPlanSetPastYearsAtom = atom(null, (get, set, val) => {
  set(ekPlanPastYearsAtom, val)
})

// EkPlan volatile state
export const ekPlanYearMenuAnchorAtom = atom(null)
export const ekPlanSetYearMenuAnchorAtom = atom(null, (get, set, anchor) => {
  set(ekPlanYearMenuAnchorAtom, anchor)
})

const initialYearClicked = {
  year: null,
  tpopId: null,
  title: null,
  ekPlan: false,
  ekfPlan: false,
}
export const ekPlanYearClickedAtom = atom(initialYearClicked)
export const ekPlanSetYearClickedAtom = atom(null, (get, set, val) => {
  set(ekPlanYearClickedAtom, val)
})
export const ekPlanCloseYearCellMenuAtom = atom(null, (get, set) => {
  set(ekPlanYearMenuAnchorAtom, null)
  set(ekPlanYearClickedAtom, initialYearClicked)
})

export const ekPlanApsDataAtom = atom([])
export const ekPlanSetApsDataAtom = atom(null, (get, set, val) => {
  set(ekPlanApsDataAtom, val)
})

// EkPlan einheitsByAp computed value
export const ekPlanEinheitsByApAtom = atom((get) => {
  const apsData = get(ekPlanApsDataAtom)
  const nodes = apsData?.allAps?.nodes ?? []
  const e = {}
  nodes.forEach((node) => {
    e[node.id] = (node?.ekzaehleinheitsByApId?.nodes ?? []).map(
      (o) => o.tpopkontrzaehlEinheitWerteByZaehleinheitId.code,
    )
  })
  return e
})

// sortedBeobFields
const defaultSortedBeobFields = [
  'taxon',
  'ESPECE',
  'presence',
  'PRESENCE',
  'xy_radius',
  'abundance_cat',
  'abundance',
  'CAT_ABONDANCE_1',
  'XY_PRECISION',
  'observers',
  'NOM_PERSONNE_OBS',
  'PRENOM_PERSONNE_OBS',
  'obs_day',
  'obs_month',
  'obs_year',
  'J_NOTE',
  'M_NOTE',
  'A_NOTE',
  'remarks',
  'locality_descript',
  'DESC_LOCALITE',
  'DESC_LOCALITE_',
  'municipality',
  'canton',
  'NOM_COMMUNE',
  'CO_CANTON',
  'interpretation_note',
  'doubt_status',
  'phenology_code',
  'count_unit',
  'obs_type',
  'original_taxon',
  'taxon_expert',
  'determinavit_cf',
  'specimen_type',
  'NOM_ORIGINAL',
  'NOM_COMPLET',
  'introduction',
  'DETERMINAVIT_CF',
  'DETERMINAVIT_CF_',
  'x_swiss',
  'y_swiss',
  'COORDONNEE_FED_E',
  'COORDONNEE_FED_N',
  'FNS_XGIS',
  'FNS_YGIS',
  'STATION',
]

// needs to update when defaultSortedBeobFields is changed - thus not with storage
export const sortedBeobFieldsAtom = atom(defaultSortedBeobFields)

export const setSortedBeobFieldsAtom = atom(null, (get, set, val) => {
  set(
    sortedBeobFieldsAtom,
    val.filter((v) => !!v),
  )
})

// exportFileType
export const exportFileTypeAtom = atomWithStorage('exportFileType', 'xlsx')

export const setExportFileTypeAtom = atom(null, (get, set, val) => {
  set(exportFileTypeAtom, val)
})

// Helper to get gql filter atom by table name
export const getGqlFilterAtomByTable = (table: string) => {
  const atomMap = {
    ap: treeApGqlFilterAtom,
    pop: treePopGqlFilterAtom,
    tpop: treeTpopGqlFilterAtom,
    tpopmassn: treeTpopmassnGqlFilterAtom,
    ek: treeEkGqlFilterAtom,
    ekf: treeEkfGqlFilterAtom,
    tpopkontr: treeTpopkontrGqlFilterAtom,
    beobNichtBeurteilt: treeBeobGqlFilterAtom('nichtBeurteilt'),
    beobNichtZuzuordnen: treeBeobGqlFilterAtom('nichtZuzuordnen'),
    beobZugeordnet: treeBeobGqlFilterAtom('zugeordnet'),
  }
  return atomMap[table]
}
