import { createStore, atom } from 'jotai'
import type { Getter } from 'jotai/vanilla'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import queryString from 'query-string'
import { isEqual, merge } from 'es-toolkit'
import type {
  AdresseFilter,
  ApFilter,
  BeobFilter,
  EkAbrechnungstypWerteFilter,
  PopFilter,
  TpopApberrelevantGrundWerteFilter,
  TpopFilter,
  TpopkontrFilter,
  TpopkontrzaehlEinheitWerteFilter,
  TpopmassnFilter,
  UserFilter,
} from '../gql/graphql.ts'
import isUuid from 'is-uuid'
import type { ApolloClient } from '@apollo/client'
import type { QueryClient } from '@tanstack/react-query'

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

// Some atoms with storage should not sync over all tabs:
// a JSON storage with the subscribe method disabled (no cross-tab sync).
// Explicitly typed as SyncStorage so atom getters don't widen to `T | Promise<T>`.
const createUnsubscribedStorage = <T>() => {
  const storage = createJSONStorage<T>(() => localStorage)
  storage.subscribe = undefined
  return storage
}

const isNonNilUuid = (value: unknown): value is string =>
  typeof value === 'string' && isUuid.anyNonNil(value)

// localStorage-backed atoms are typed via their initial value, but jotai's
// untyped JSON storage makes getters resolve to `T | Promise<T>`.
// localStorage access is synchronous, so this cast is safe.
const getNodeLabelFilter = (get: Getter): TreeNodeLabelFilter =>
  get(treeNodeLabelFilterAtom) as TreeNodeLabelFilter

function atomWithToggleAndStorage(
  key: string,
  initialValue: boolean,
  storage?: Parameters<typeof atomWithStorage<boolean>>[2],
) {
  const anAtom = atomWithStorage(key, initialValue, storage)
  const derivedAtom = atom(
    (get) => get(anAtom),
    (get, set, nextValue?: boolean) => {
      const update = nextValue ?? !get(anAtom)
      set(anAtom, update)
    },
  )

  return derivedAtom
}

export const store = createStore()

// Tree atoms (migrated from mobx)
export const treeOpenNodesAtom = atom<(string | number)[][]>([])
export const treeSetOpenNodesAtom = atom(
  () => null,
  (_, set, val: (string | number)[][]) => {
    // need set to ensure contained arrays are unique
    const uniqueSet = new Set(val)
    set(treeOpenNodesAtom, Array.from(uniqueSet))
  },
)

export const treeAddOpenNodesAtom = atom(
  () => null,
  (get, set, nodes: (string | number)[][]) => {
    // need set to ensure contained arrays are unique
    const currentOpenNodes = get(treeOpenNodesAtom)
    const uniqueSet = new Set([...currentOpenNodes, ...nodes])
    set(treeOpenNodesAtom, Array.from(uniqueSet))
  },
)

export const treeActiveNodeArrayAtom = atom<(string | number)[]>([])

export const treeProjIdInActiveNodeArrayAtom = atom((get) => {
  const activeNodeArray = get(treeActiveNodeArrayAtom)
  if (activeNodeArray.includes('Projekte')) {
    const indexOfId = activeNodeArray.indexOf('Projekte') + 1
    if (activeNodeArray.length > indexOfId) {
      const id = activeNodeArray?.[indexOfId]
      if (isNonNilUuid(id)) return id
    }
  }
  return undefined
})

export const treeApIdInActiveNodeArrayAtom = atom((get) => {
  const activeNodeArray = get(treeActiveNodeArrayAtom)
  if (activeNodeArray.length > 3 && activeNodeArray[2] === 'Arten') {
    const id = activeNodeArray[3]
    if (isNonNilUuid(id)) return id
  }
  return undefined
})

export const treePopIdInActiveNodeArrayAtom = atom((get) => {
  const activeNodeArray = get(treeActiveNodeArrayAtom)
  if (activeNodeArray.length > 5 && activeNodeArray[4] === 'Populationen') {
    const id = activeNodeArray[5]
    if (isNonNilUuid(id)) return id
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
    if (isNonNilUuid(id)) return id
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
    if (isNonNilUuid(id)) return id
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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const apFilter = get(treeApFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare hierarchy filter
  const singleFilterByHierarchy: ApFilter = {}

  // 2. prepare data filter
  let filterArrayInStore = dataFilter.ap ? [...dataFilter.ap] : []
  if (filterArrayInStore.length > 1) {
    // check if last is empty
    // empty last is just temporary because user created new "oder" and has not yet input criteria
    // remove it or filter result will be wrong (show all) if criteria.length > 1!
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    // Add empty filter if no criteria exist yet
    filterArrayInStore = initialDataFilterValues.ap.slice(0, 1)
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
      store.set(treeApFilterAtom, false)
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

  const filterArray: ApFilter[] = []
  for (const filter of filterArrayInStore) {
    const singleFilter: ApFilter = { ...singleFilterByHierarchy }

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
      const expression =
        (apType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
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
    all:
      Object.keys(singleFilterByHierarchy).length ?
        singleFilterByHierarchy
      : { or: [] },
    filtered: { or: filterArrayWithoutEmptyObjects },
  }

  return apGqlFilter
})

export const treeApGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = getNodeLabelFilter(get)
  const apFilter = get(treeApFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare data filter
  let filterArrayInStore = dataFilter.ap ? [...dataFilter.ap] : []
  if (filterArrayInStore.length > 1) {
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    filterArrayInStore = initialDataFilterValues.ap.slice(0, 1)
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
      store.set(treeApFilterAtom, false)
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

  const filterArray: ApFilter[] = []
  for (const filter of filterArrayInStore) {
    const singleFilter: ApFilter = {}

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
      const expression =
        (apType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
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
  const nodeLabelFilter = getNodeLabelFilter(get)
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
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      // popping did not work
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    // Add empty filter if no criteria exist yet
    // Goal: enable adding filters for hierarchy, label and geometry
    // If no filters were added: this empty element will be removed after looping
    filterArrayInStore = initialDataFilterValues.pop.slice(0, 1)
  }

  // 3. build data filter
  const filterArray: PopFilter[] = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    const singleFilter: PopFilter = {
      ...merge(singleFilterByHierarchy, singleFilterByParentFiltersForFiltered),
    }
    // add data filter
    const dataFilterPop = { ...filter }
    const popFilterValues = Object.entries(dataFilterPop).filter(
      (e) => e[1] !== null,
    )
    popFilterValues.forEach(([key, value]) => {
      const expression =
        (popType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
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
    all:
      Object.keys(singleFilterForAll).length ? singleFilterForAll : { or: [] },
    filtered: { or: filterArrayWithoutEmptyObjects },
  }

  return popGqlFilter
})

export const treePopGqlFilterForTreeAtom = atom((get) => {
  // Access jotai atoms
  const nodeLabelFilter = getNodeLabelFilter(get)
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
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      // popping did not work
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    // Add empty filter if no criteria exist yet
    // Goal: enable adding filters for hierarchy, label and geometry
    // If no filters were added: this empty element will be removed after looping
    filterArrayInStore = initialDataFilterValues.pop.slice(0, 1)
  }

  // 2. build data filter
  const filterArray: PopFilter[] = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    const singleFilter: PopFilter = {}
    // add data filter
    const dataFilterPop = { ...filter }
    const popFilterValues = Object.entries(dataFilterPop).filter(
      (e) => e[1] !== null,
    )
    popFilterValues.forEach(([key, value]) => {
      const expression =
        (popType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)
  const apId = get(treeApIdInActiveNodeArrayAtom)

  // Access jotai atom for parent filter
  const popGqlFilter = get(treePopGqlFilterAtom)

  // 1. prepare hierarchy filter
  const apHiearchyFilter =
    apId ? { popByPopId: { apId: { equalTo: apId } } } : {}
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
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    filterArrayInStore = initialDataFilterValues.tpop.slice(0, 1)
  }

  // 3. build data filter
  const filterArray: TpopFilter[] = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    // BEWARE: merge without spreading leads to the same object being used during the for loop!
    const singleFilter: TpopFilter = {
      ...merge(singleFilterByHierarchy, singleFilterByParentFiltersForFiltered),
    }
    // add data filter
    const dataFilterTpop = { ...filter }
    const tpopFilterValues = Object.entries(dataFilterTpop).filter(
      (e) => e[1] !== null,
    )
    tpopFilterValues.forEach(([key, value]) => {
      const expression =
        (tpopType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
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
    all:
      Object.keys(singleFilterForAll).length ? singleFilterForAll : { or: [] },
    filtered: { or: filterArrayWithoutEmptyObjects },
  }

  return tpopGqlFilter
})

export const treeTpopGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = getNodeLabelFilter(get)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare data filter
  let filterArrayInStore = dataFilter.tpop ? [...dataFilter.tpop] : []
  if (filterArrayInStore.length > 1) {
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    filterArrayInStore = initialDataFilterValues.tpop.slice(0, 1)
  }

  // 2. build data filter
  const filterArray: TpopFilter[] = []
  for (const filter of filterArrayInStore) {
    const singleFilter: TpopFilter = {}
    // add data filter
    const dataFilterTpop = { ...filter }
    const tpopFilterValues = Object.entries(dataFilterTpop).filter(
      (e) => e[1] !== null,
    )
    tpopFilterValues.forEach(([key, value]) => {
      const expression =
        (tpopType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)
  const apId = get(treeApIdInActiveNodeArrayAtom)
  const tpopGqlFilter = get(treeTpopGqlFilterAtom)

  // 1. prepare hierarchy filter
  const apHiearchyFilter =
    apId ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } } : {}
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
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      // popping did not work
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    // Add empty filter if no criteria exist yet
    // Goal: enable adding filters for hierarchy, label and geometry
    // If no filters were added: this empty element will be removed after looping
    filterArrayInStore = [initialTpopmassn]
  }
  // 3. build data filter
  const filterArray: TpopmassnFilter[] = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    const singleFilter: TpopmassnFilter = {
      ...merge(singleFilterByHierarchy, singleFilterByParentFiltersForFiltered),
    }
    // add data filter
    const dataFilterTpopmassn = { ...filter }
    const tpopmassnFilterValues = Object.entries(dataFilterTpopmassn).filter(
      (e) => e[1] !== null,
    )
    tpopmassnFilterValues.forEach(([key, value]) => {
      const expression =
        (tpopmassnType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
    })
    // add node label filter
    if (nodeLabelFilter.tpopmassn) {
      singleFilter.label = {
        includesInsensitive: nodeLabelFilter.tpopmassn,
      }
    }
    // add mapFilter
    if (mapFilter) {
      singleFilter.tpopByTpopId = {
        ...singleFilter.tpopByTpopId,
        geomPoint: {
          coveredBy: mapFilter,
        },
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
    all:
      Object.keys(singleFilterForAll).length ? singleFilterForAll : { or: [] },
    filtered: { or: filterArrayWithoutEmptyObjects },
  }

  return tpopmassnGqlFilter
})

export const treeTpopmassnGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = getNodeLabelFilter(get)
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
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      // popping did not work
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    // Add empty filter if no criteria exist yet
    // Goal: enable adding filters for hierarchy, label and geometry
    // If no filters were added: this empty element will be removed after looping
    filterArrayInStore = [initialTpopmassn]
  }
  // 2. build data filter
  const filterArray: TpopmassnFilter[] = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    const singleFilter: TpopmassnFilter = {}
    // add data filter
    const dataFilterTpopmassn = { ...filter }
    const tpopmassnFilterValues = Object.entries(dataFilterTpopmassn).filter(
      (e) => e[1] !== null,
    )
    tpopmassnFilterValues.forEach(([key, value]) => {
      const expression =
        (tpopmassnType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
    })
    // add node label filter
    if (nodeLabelFilter.tpopmassn) {
      singleFilter.label = {
        includesInsensitive: nodeLabelFilter.tpopmassn,
      }
    }
    // add mapFilter
    if (mapFilter) {
      singleFilter.tpopByTpopId = {
        ...singleFilter.tpopByTpopId,
        geomPoint: {
          coveredBy: mapFilter,
        },
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
    const nodeLabelFilter = getNodeLabelFilter(get)
    const gqlFilter: TpopkontrzaehlEinheitWerteFilter = {}
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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const gqlFilter: EkAbrechnungstypWerteFilter = {}
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
    const nodeLabelFilter = getNodeLabelFilter(get)
    // include a condition that ensures a filter is always set
    const gqlFilter: TpopApberrelevantGrundWerteFilter = {
      id: { isNull: false },
    }
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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const gqlFilter: TpopApberrelevantGrundWerteFilter = {}
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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const gqlFilter: AdresseFilter = {}

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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const gqlFilter: UserFilter = {}

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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)
  const tpopGqlFilter = get(treeTpopGqlFilterAtom)

  // 1. prepare hierarchy filter
  const apId = get(treeApIdInActiveNodeArrayAtom)
  const apHiearchyFilter =
    apId ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } } : {}
  const projHiearchyFilter = {}
  const singleFilterByHierarchy = merge(
    merge(
      {
        or: [
          { typ: { isNull: true } },
          { typ: { in: ['Kontrolle', 'Ausgangszustand'] } },
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
  let filterArrayInStore =
    dataFilter.tpopfeldkontr ? [...dataFilter.tpopfeldkontr] : []
  if (filterArrayInStore.length > 1) {
    // check if last is empty
    // empty last is just temporary because user created new "oder" and has not yet input criteria
    // remove it or filter result will be wrong (show all) if criteria.length > 1!
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      // popping did not work
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    // Add empty filter if no criteria exist yet
    // Goal: enable adding filters for hierarchy, label and geometry
    // If no filters were added: this empty element will be removed after looping
    filterArrayInStore = [initialTpopfeldkontr]
  }

  // 3. build data filter
  const filterArray: TpopkontrFilter[] = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    const singleFilter: TpopkontrFilter = {
      ...merge(singleFilterByHierarchy, singleFilterByParentFiltersForFiltered),
    }
    // add data filter
    const dataFilterObj = { ...filter }
    const filterValues = Object.entries(dataFilterObj).filter(
      (e) => e[1] !== null,
    )
    filterValues.forEach(([key, value]) => {
      const expression =
        (tpopfeldkontrType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
    })
    // add node label filter
    if (nodeLabelFilter.tpopfeldkontr) {
      singleFilter.labelEk = {
        includesInsensitive: nodeLabelFilter.tpopfeldkontr,
      }
    }
    // add mapFilter
    if (mapFilter) {
      singleFilter.tpopByTpopId = {
        ...singleFilter.tpopByTpopId,
        geomPoint: {
          coveredBy: mapFilter,
        },
      }
    }
    // Object need to filter by typ
    if (!singleFilter.typ) {
      singleFilter.typ = { distinctFrom: 'Freiwilligen-Kontrolle' }
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
      Object.keys(singleFilterForAll).length ? singleFilterForAll : { or: [] },
    filtered: { or: filterArrayWithoutEmptyObjects },
  }

  return ekGqlFilter
})

export const treeEkGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = getNodeLabelFilter(get)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare data filter
  let filterArrayInStore =
    dataFilter.tpopfeldkontr ? [...dataFilter.tpopfeldkontr] : []
  if (filterArrayInStore.length > 1) {
    // check if last is empty
    // empty last is just temporary because user created new "oder" and has not yet input criteria
    // remove it or filter result will be wrong (show all) if criteria.length > 1!
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      // popping did not work
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    // Add empty filter if no criteria exist yet
    // Goal: enable adding filters for hierarchy, label and geometry
    // If no filters were added: this empty element will be removed after looping
    filterArrayInStore = [initialTpopfeldkontr]
  }

  // 2. build data filter
  const filterArray: TpopkontrFilter[] = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    const singleFilter: TpopkontrFilter = {}
    // add data filter
    const dataFilter = { ...filter }
    const filterValues = Object.entries(dataFilter).filter((e) => e[1] !== null)
    filterValues.forEach(([key, value]) => {
      const expression =
        (tpopfeldkontrType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
    })
    // add node label filter
    if (nodeLabelFilter.tpopkontr) {
      singleFilter.labelEk = {
        includesInsensitive: nodeLabelFilter.tpopkontr,
      }
    }
    // add mapFilter
    if (mapFilter) {
      singleFilter.tpopByTpopId = {
        ...singleFilter.tpopByTpopId,
        geomPoint: {
          coveredBy: mapFilter,
        },
      }
    }
    // Object need to filter by typ
    if (!singleFilter.typ) {
      singleFilter.typ = { distinctFrom: 'Freiwilligen-Kontrolle' }
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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)
  const tpopGqlFilter = get(treeTpopGqlFilterAtom)

  // 1. prepare hierarchy filter
  const apId = get(treeApIdInActiveNodeArrayAtom)
  const apHiearchyFilter =
    apId ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } } : {}
  const projHiearchyFilter = {}
  const singleFilterByHierarchy = merge(
    merge({ typ: { equalTo: 'Freiwilligen-Kontrolle' } }, apHiearchyFilter),
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
  let filterArrayInStore =
    dataFilter.tpopfreiwkontr ? [...dataFilter.tpopfreiwkontr] : []
  if (filterArrayInStore.length > 1) {
    // check if last is empty
    // empty last is just temporary because user created new "oder" and has not yet input criteria
    // remove it or filter result will be wrong (show all) if criteria.length > 1!
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      // popping did not work
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    // Add empty filter if no criteria exist yet
    // Goal: enable adding filters for hierarchy, label and geometry
    // If no filters were added: this empty element will be removed after looping
    filterArrayInStore = [initialTpopfreiwkontr]
  }

  // 3. build data filter
  const filterArray: TpopkontrFilter[] = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    const singleFilter: TpopkontrFilter = {
      ...merge(singleFilterByHierarchy, singleFilterByParentFiltersForFiltered),
    }
    // add data filter
    const dataFilterObj = { ...filter }
    const filterValues = Object.entries(dataFilterObj).filter(
      (e) => e[1] !== null,
    )
    filterValues.forEach(([key, value]) => {
      const expression =
        (tpopfreiwkontrType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
    })
    // add node label filter
    if (nodeLabelFilter.tpopkontr) {
      singleFilter.labelEkf = {
        includesInsensitive: nodeLabelFilter.tpopkontr,
      }
    }
    // add mapFilter
    if (mapFilter) {
      singleFilter.tpopByTpopId = {
        ...singleFilter.tpopByTpopId,
        geomPoint: {
          coveredBy: mapFilter,
        },
      }
    }
    // Object need to filter by typ
    if (!singleFilter.typ) {
      singleFilter.typ = { equalTo: 'Freiwilligen-Kontrolle' }
    }
    filterArray.push(singleFilter)
  }

  // extra check to ensure no empty objects exist
  const filterArrayWithoutEmptyObjects = filterArray.filter(
    (el) => Object.keys(el).length > 0,
  )

  const ekfGqlFilter = {
    all:
      Object.keys(singleFilterForAll).length ? singleFilterForAll : { or: [] },
    filtered: { or: filterArrayWithoutEmptyObjects },
  }

  return ekfGqlFilter
})

export const treeEkfGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = getNodeLabelFilter(get)
  const mapFilter = get(treeMapFilterAtom)
  const dataFilter = get(treeDataFilterAtom)

  // 1. prepare data filter
  let filterArrayInStore =
    dataFilter.tpopfreiwkontr ? [...dataFilter.tpopfreiwkontr] : []
  if (filterArrayInStore.length > 1) {
    // check if last is empty
    // empty last is just temporary because user created new "oder" and has not yet input criteria
    // remove it or filter result will be wrong (show all) if criteria.length > 1!
    const last = filterArrayInStore[filterArrayInStore.length - 1]
    const lastIsEmpty =
      Object.values(last ?? {}).filter((v) => v !== null).length === 0
    if (lastIsEmpty) {
      // popping did not work
      filterArrayInStore = filterArrayInStore.slice(0, -1)
    }
  } else if (filterArrayInStore.length === 0) {
    // Add empty filter if no criteria exist yet
    // Goal: enable adding filters for hierarchy, label and geometry
    // If no filters were added: this empty element will be removed after looping
    filterArrayInStore = [initialTpopfreiwkontr]
  }

  // 2. build data filter
  const filterArray: TpopkontrFilter[] = []
  for (const filter of filterArrayInStore) {
    // add hierarchy filter
    const singleFilter: TpopkontrFilter = {}
    // add data filter
    const dataFilterObj = { ...filter }
    const filterValues = Object.entries(dataFilterObj).filter(
      (e) => e[1] !== null,
    )
    filterValues.forEach(([key, value]) => {
      const expression =
        (tpopfreiwkontrType as Record<string, string>)[key] === 'string' ?
          'includes'
        : 'equalTo'
      ;(singleFilter as Record<string, unknown>)[key] = { [expression]: value }
    })
    // add node label filter
    if (nodeLabelFilter.tpopkontr) {
      singleFilter.labelEkf = {
        includesInsensitive: nodeLabelFilter.tpopkontr,
      }
    }
    // add mapFilter
    if (mapFilter) {
      singleFilter.tpopByTpopId = {
        ...singleFilter.tpopByTpopId,
        geomPoint: {
          coveredBy: mapFilter,
        },
      }
    }
    // Object needs to filter by typ
    if (!singleFilter.typ) {
      singleFilter.typ = { equalTo: 'Freiwilligen-Kontrolle' }
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
    const nodeLabelFilter = getNodeLabelFilter(get)
    const mapFilter = get(treeMapFilterAtom)
    const tpopGqlFilter = get(treeTpopGqlFilterAtom)

    // 1. prepare hierarchy filter
    const projId = get(treeProjIdInActiveNodeArrayAtom)

    // need list of all open apIds
    const apId = get(treeApIdInActiveNodeArrayAtom)
    const openNodes = get(treeOpenNodesAtom)
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
      apId ? { tpopByTpopId: { popByPopId: { apId: { equalTo: apId } } } } : {}
    const projHiearchyFilter = {}
    const singleFilterByHierarchy = merge(apHiearchyFilter, projHiearchyFilter)
    const typeFilter: BeobFilter = {
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
      type === 'zugeordnet' ?
        merge(
          merge(merge(typeFilter, apFilter), singleFilterByHierarchy),
          singleFilterByParentFiltersForAll,
        )
      : merge(typeFilter, apFilter)
    const singleFilterByParentFiltersForFiltered = {
      tpopByTpopId: tpopGqlFilter.filtered,
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
      singleFilter = merge(singleFilter, singleFilterByParentFiltersForFiltered)
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

    return beobGqlFilter
  })

export const treeBeobNichtBeurteiltGqlFilterForTreeAtom = atom((get) => {
  const nodeLabelFilter = getNodeLabelFilter(get)
  const mapFilter = get(treeMapFilterAtom)
  const filter: BeobFilter = {
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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const mapFilter = get(treeMapFilterAtom)
  const filter: BeobFilter = {
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
  const nodeLabelFilter = getNodeLabelFilter(get)
  const mapFilter = get(treeMapFilterAtom)
  const filter: BeobFilter = {
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

export const treeApFilterAtom = atomWithStorage<boolean>(
  'apFilter',
  true,
  createUnsubscribedStorage<boolean>(),
  {
    getOnInit: true,
  },
)

export const treeMapFilterAtom = atom(undefined)
export const treeEmptyMapFilterAtom = atom(null, (_get, set) => {
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
      [table]: (initialDataFilterValues as Record<string, unknown[]>)[table],
    })
  },
)

export const treeDataFilterEmptyTabAtom = atom(
  null,
  (get, set, { table, activeTab }: { table: string; activeTab: number }) => {
    const current = get(treeDataFilterAtom)
    const tableData = [...((current as Record<string, unknown[]>)[table] ?? [])]
    if (tableData.length === 1) {
      const firstElement = { ...(tableData[0] as Record<string, unknown>) }
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
      [table]: [...((current as Record<string, unknown[]>)[table] ?? []), val],
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
    const tableData = [...((current as Record<string, unknown[]>)[table] ?? [])]
    if (index !== undefined) {
      if (!tableData[index]) {
        tableData.push(
          (initialDataFilterValues as Record<string, unknown>)[table],
        )
      }
      tableData[index] = {
        ...(tableData[index] as Record<string, unknown>),
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

export const treeDataFilterEmptyAtom = atom(null, (_get, set) => {
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
  (get, set, val: (string | number)[]) => {
    if (isEqual(val, get(treeActiveNodeArrayAtom))) {
      // do not do this if already set
      // trying to stop vicious cycle of reloading in first start after update
      return
    }
    // always set missing open nodes
    const extraOpenNodes: (string | number)[][] = []
    val.forEach((_v, i) => {
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
  (_get, set, enforce) => {
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
  (_get, set, enforce) => {
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
    // add hysteresis to avoid switching back and forth when resizing around the breakpoint
    // tuned to common laptop widths so the mode stays stable near ~1000px
    const hysteresisPx = 100
    const minWidthForDesktop = constants.mobileViewMaxWidth + hysteresisPx
    const maxWidthForMobile = constants.mobileViewMaxWidth - hysteresisPx
    if (isDesktopView) {
      if (width <= maxWidthForMobile) set(isDesktopViewAtom, false)
      return
    }
    if (width >= minWidthForDesktop) set(isDesktopViewAtom, true)
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
  (_get, set, value: boolean) => set(mapHideControlsAtom, value),
)
export const mapMouseCoordinatesAtom = atom({ x: 2683000, y: 1247500 })
export const setMapMouseCoordinatesAtom = atom(
  (get) => get(mapMouseCoordinatesAtom),
  (_get, set, { x, y }: { x: number; y: number }) =>
    set(mapMouseCoordinatesAtom, { x, y }),
)
// setting bounds works imperatively with map.fitBounds since v3
// but keeping bounds in store as last used bounds will be re-applied on next map opening
export const mapBoundsAtom = atomWithStorage('mapBounds', [
  [47.159, 8.354],
  [47.696, 8.984],
])
export const setMapBoundsAtom = atom(
  (get) => get(mapBoundsAtom),
  (_get, set, value: number[][]) => set(mapBoundsAtom, value),
)
export const idOfTpopBeingLocalizedAtom = atom<string | null>(null)
export const setIdOfTpopBeingLocalizedAtom = atom(
  (get) => get(idOfTpopBeingLocalizedAtom),
  (_get, set, value: string | null) => set(idOfTpopBeingLocalizedAtom, value),
)
export const mapShowApfLayersForMultipleApsAtom = atomWithStorage(
  'mapShowApfLayersForMultipleAps',
  false,
)
export const setMapShowApfLayersForMultipleApsAtom = atom(
  (get) => get(mapShowApfLayersForMultipleApsAtom),
  (_get, set, value: boolean) => set(mapShowApfLayersForMultipleApsAtom, value),
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
  { label: 'Schutzanordnungen', value: 'ZhSvo' },
  { label: 'Pflegeplan aktuelles Jahr', value: 'ZhPflegeplanAJ' },
  { label: 'Pflegeplan vergangenes Jahr', value: 'ZhPflegeplanVJ' },
  { label: 'Pflegeplan vor-vergangenes Jahr', value: 'ZhPflegeplanVVJ' },
  {
    label: 'Lebensraum- und Vegetationskartierungen',
    value: 'ZhLrVegKartierungen',
  },
  { label: 'Wälder: lichte', value: 'ZhLichteWaelder' },
  { label: 'Wälder: Vegetation', value: 'ZhWaelderVegetation' },
  { label: 'Forstreviere', value: 'ZhForstreviereWms' },
])
export const setMapOverlaysAtom = atom(
  (get) => get(mapOverlaysAtom),
  (_get, set, value: { label: string; value: string }[]) =>
    set(mapOverlaysAtom, value),
)
export const mapActiveOverlaysAtom = atomWithStorage<string[]>(
  'mapActiveOverlays',
  [],
)
export const setMapActiveOverlaysAtom = atom(
  (get) => get(mapActiveOverlaysAtom),
  (_get, set, value: string[]) => set(mapActiveOverlaysAtom, value),
)
export const mapActiveBaseLayerAtom = atomWithStorage(
  'mapActiveBaseLayer',
  'OsmColor',
)
export const setMapActiveBaseLayerAtom = atom(
  (get) => get(mapActiveBaseLayerAtom),
  (_get, set, value: string) => set(mapActiveBaseLayerAtom, value),
)
export const mapPopIconAtom = atomWithStorage(
  'mapPopIcon',
  'statusGroupSymbols',
)
export const setMapPopIconAtom = atom(
  (get) => get(mapPopIconAtom),
  (_get, set, value: string) => set(mapPopIconAtom, value),
)
export const mapTpopIconAtom = atomWithStorage(
  'mapTpopIcon',
  'statusGroupSymbols',
)
export const setMapTpopIconAtom = atom(
  (get) => get(mapTpopIconAtom),
  (_get, set, value: string) => set(mapTpopIconAtom, value),
)
export const mapPopLabelAtom = atomWithStorage('mapPopLabel', 'nr')
export const setMapPopLabelAtom = atom(
  (get) => get(mapPopLabelAtom),
  (_get, set, value: string) => set(mapPopLabelAtom, value),
)
export const mapTpopLabelAtom = atomWithStorage('mapTpopLabel', 'nr')
export const setMapTpopLabelAtom = atom(
  (get) => get(mapTpopLabelAtom),
  (_get, set, value: string) => set(mapTpopLabelAtom, value),
)
export const mapBeobDetailsOpenAtom = atom(false)
export const setMapBeobDetailsOpenAtom = atom(
  (get) => get(mapBeobDetailsOpenAtom),
  (_get, set, value: boolean) => set(mapBeobDetailsOpenAtom, value),
)

// used to open tree2 on a specific activeNodeArray
export const tree2SrcAtom = atom('')
export const resetTree2SrcAtom = atom(null, (_get, set) => {
  set(tree2SrcAtom, '')
})
export const setTree2SrcByActiveNodeArrayAtom = atom(
  null,
  (
    _get,
    set,
    {
      activeNodeArray,
      search,
      onlyShowActivePath,
    }: {
      activeNodeArray: (string | number)[]
      search: string
      onlyShowActivePath?: boolean | undefined
    },
  ) => {
    const iFrameSearch = queryString.parse(search)
    // need to alter projekteTabs:
    if (Array.isArray(iFrameSearch.projekteTabs)) {
      iFrameSearch.projekteTabs = iFrameSearch.projekteTabs
        // - remove non-tree2 values
        .filter((t) => (t ?? '').includes('2'))
        // - rewrite tree2 values to tree values
        .map((t) => (t ?? '').replace('2', ''))
    } else if (iFrameSearch.projekteTabs) {
      iFrameSearch.projekteTabs = [iFrameSearch.projekteTabs]
        // - remove non-tree2 values
        .filter((t) => t.includes('2'))
        // - rewrite tree2 values to tree values
        .map((t) => t.replace('2', ''))
    }
    if (onlyShowActivePath) {
      iFrameSearch.onlyShowActivePath = 'true'
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
export const treeLastTouchedNodeAtom = atom<(string | number)[]>([])
export const setTreeLastTouchedNodeAtom = atom(
  (get) => get(treeLastTouchedNodeAtom),
  (_get, set, value: (string | number)[]) =>
    set(treeLastTouchedNodeAtom, value),
)

// treeShowPopIcon - controls whether to show pop icons in tree
export const treeShowPopIconAtom = atomWithStorage('treeShowPopIcon', true)
export const toggleTreeShowPopIconAtom = atom(
  (get) => get(treeShowPopIconAtom),
  (get, set) => set(treeShowPopIconAtom, !get(treeShowPopIconAtom)),
)
export const setTreeShowPopIconAtom = atom(
  (get) => get(treeShowPopIconAtom),
  (_get, set, value: boolean) => set(treeShowPopIconAtom, value),
)

// treeShowTpopIcon - controls whether to show tpop icons in tree
export const treeShowTpopIconAtom = atomWithStorage('treeShowTpopIcon', true)
export const toggleTreeShowTpopIconAtom = atom(
  (get) => get(treeShowTpopIconAtom),
  (get, set) => set(treeShowTpopIconAtom, !get(treeShowTpopIconAtom)),
)
export const setTreeShowTpopIconAtom = atom(
  (get) => get(treeShowTpopIconAtom),
  (_get, set, value: boolean) => set(treeShowTpopIconAtom, value),
)

// treeNodeLabelFilter - stores filter values for tree node labels
export type TreeNodeLabelFilter = Record<string, string | null>

export const treeNodeLabelFilterAtom = atomWithStorage<TreeNodeLabelFilter>(
  'treeNodeLabelFilter',
  {
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
  },
  createUnsubscribedStorage<TreeNodeLabelFilter>(),
)

export const treeSetNodeLabelFilterKeyAtom = atom(
  (_get) => null,
  (get, set, { key, value }: { key: string; value: string | null }) => {
    const current = getNodeLabelFilter(get)
    // only write if changed
    if (current[key] !== value) {
      set(treeNodeLabelFilterAtom, {
        ...current,
        [key]: value,
      } as TreeNodeLabelFilter)
    }
  },
)

export const treeEmptyNodeLabelFilterAtom = atom(
  (_get) => null,
  (_get, set) => {
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
  (_get) => null,
  (get, set) => {
    const current = getNodeLabelFilter(get)
    set(treeNodeLabelFilterAtom, {
      ap: current.ap ?? null,
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
  [] as string[],
)
export const setMapActiveApfloraLayersAtom = atom(
  (get) => get(mapActiveApfloraLayersAtom),
  (_get, set, value: string[]) => set(mapActiveApfloraLayersAtom, value),
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

export const tsQueryClientAtom = atom<QueryClient | null>(null)
export const apolloClientAtom = atom<ApolloClient | null>(null)

// Notifications
export interface Notification {
  key: number
  message: string
  title?: string
  options?: Record<string, unknown> & { key?: number; variant?: string }
}
export const notificationsAtom = atom<Notification[]>([])

export const addNotificationAtom = atom(
  null,
  (get, set, note: Omit<Notification, 'key'>) => {
    const notifications = get(notificationsAtom)
    const key = note.options?.key ?? new Date().getTime() + Math.random()
    set(notificationsAtom, [
      ...notifications,
      {
        key,
        ...note,
      },
    ])
  },
)

export const removeNotificationAtom = atom(null, (get, set, key: number) => {
  const notifications = get(notificationsAtom)
  set(
    notificationsAtom,
    notifications.filter((n) => n.key !== key),
  )
})

// navigate function atom
// Store as object because Jotai doesn't handle bare functions well
// The setter accepts a function and wraps it in { fn: function }
const navigateObjectBaseAtom = atom<{ fn: (path: string) => void } | undefined>(
  undefined,
)
export const navigateObjectAtom = atom(
  (get) => get(navigateObjectBaseAtom),
  (_get, set, navigateFunction: (path: string) => void) => {
    set(navigateObjectBaseAtom, { fn: navigateFunction })
  },
)
export const navigateAtom = atom((get) => get(navigateObjectBaseAtom)?.fn)

// Assigning Beob
export const assigningBeobAtom = atom(false)
export const setAssigningBeobAtom = atom(null, (_get, set, val: boolean) => {
  set(assigningBeobAtom, val)
})

// Choose AP dialogs
export const openChooseApToCopyEkfrequenzsFromAtom = atom(false)
export const setOpenChooseApToCopyEkfrequenzsFromAtom = atom(
  null,
  (_get, set, val: boolean) => {
    set(openChooseApToCopyEkfrequenzsFromAtom, val)
  },
)
export const openChooseApToCopyErfkritsFromAtom = atom(false)
export const setOpenChooseApToCopyErfkritsFromAtom = atom(
  null,
  (_get, set, val: boolean) => {
    set(openChooseApToCopyErfkritsFromAtom, val)
  },
)

// Print state
export const isPrintAtom = atom(false)
export const setIsPrintAtom = atom(null, (_get, set, val: boolean) => {
  set(isPrintAtom, val)
})
export const isEkfSinglePrintAtom = atom(false)
export const setIsEkfSinglePrintAtom = atom(null, (_get, set, val: boolean) => {
  set(isEkfSinglePrintAtom, val)
})

// User
export interface User {
  name: string
  token: string | null
  id: string | null
}

export const userAtom = atomWithStorage<User>('user', {
  name: '',
  token: null,
  id: null,
})

export const userNameAtom = atom((get) => get(userAtom).name)
export const userTokenAtom = atom((get) => get(userAtom).token)

export const removeUserAtom = atom(null, (_get, set) => {
  set(userAtom, {
    name: '',
    token: null,
    id: null,
  })
})

// Copying
export interface Copying {
  table: string | null
  id: string | null
  label: string | null
  withNextLevel: boolean
}

export const copyingAtom = atom<Copying>({
  table: null,
  id: null,
  label: null,
  withNextLevel: false,
})

export const setCopyingAtom = atom(
  null,
  (
    _get,
    set,
    {
      table,
      id,
      label,
      withNextLevel,
    }: {
      table?: string | null | undefined
      id?: string | null | undefined
      label?: string | null | undefined
      withNextLevel: boolean
    },
  ) => {
    set(copyingAtom, {
      table: table ?? null,
      id: id ?? null,
      label: label ?? null,
      withNextLevel,
    })
  },
)

export const copyingBiotopAtom = atom({
  id: null,
  label: null,
})

export const setCopyingBiotopAtom = atom(null, (_get, set, { id, label }) => {
  set(copyingBiotopAtom, { id, label })
})

export interface Moving {
  table: string | null
  id: string | null
  label: string | null
  toTable: string | null
  fromParentId: string | null
}

export const movingAtom = atom<Moving>({
  table: null,
  id: null,
  label: null,
  toTable: null,
  fromParentId: null,
})

export const setMovingAtom = atom(
  null,
  (
    _get,
    set,
    {
      table,
      id,
      label,
      toTable,
      fromParentId,
    }: {
      table?: string | null | undefined
      id?: string | null | undefined
      label?: string | null | undefined
      toTable?: string | null | undefined
      fromParentId?: string | null | undefined
    },
  ) => {
    set(movingAtom, {
      table: table ?? null,
      id: id ?? null,
      label: label ?? null,
      toTable: toTable ?? null,
      fromParentId: fromParentId ?? null,
    })
  },
)

export const clearAllStorageAtom = atom(null, (_get, set) => {
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
export interface ToDelete {
  table: string | null
  id: string | null
  label: string | null
  url: (string | number)[] | null
  afterDeletionHook: (() => void) | null
}

export const toDeleteAtom = atom<ToDelete>({
  table: null,
  id: null,
  label: null,
  url: null,
  afterDeletionHook: null,
})

export const setToDeleteAtom = atom(
  (get) => get(toDeleteAtom),
  (
    _get,
    set,
    {
      table,
      id,
      label,
      url,
      afterDeletionHook,
    }: {
      table: string | null
      id: string | null
      label: string | null
      url: (string | number)[] | null
      afterDeletionHook: (() => void) | null
    },
  ) => {
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
  (_get, set) => {
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
export interface DeletedDataset {
  table: string
  id: string
  url: (string | number)[]
  label: string
  data?: unknown
  time?: number
  afterDeletionHook?: () => void
}

export const deletedDatasetsAtom = atom<DeletedDataset[]>([])

export const setDeletedDatasetsAtom = atom(
  (get) => get(deletedDatasetsAtom),
  (_get, set, val: DeletedDataset[]) => {
    set(deletedDatasetsAtom, val)
  },
)

export const addDeletedDatasetAtom = atom(
  (get) => get(deletedDatasetsAtom),
  (get, set, val: DeletedDataset) => {
    const current = get(deletedDatasetsAtom)
    set(deletedDatasetsAtom, [...current, val])
  },
)

export const removeDeletedDatasetByIdAtom = atom(
  (get) => get(deletedDatasetsAtom),
  (get, set, id: string) => {
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
  (_get, set, val: boolean) => {
    set(showDeletionsAtom, val)
  },
)

// EkPlan atoms
export const ekPlanShowEkAtom = atom(true)
export const ekPlanShowEkfAtom = atom(true)
export const ekPlanShowCountAtom = atom(true)
export const ekPlanShowEkCountAtom = atom(true)
export const ekPlanShowMassnAtom = atom(true)

// EkPlan aps
export const ekPlanApsAtom = atomWithStorage<
  { value: string; label: string }[]
>(
  'ekPlanAps',
  [],
  createUnsubscribedStorage<{ value: string; label: string }[]>(),
)
export const ekPlanApValuesAtom = atom((get) => {
  const aps = get(ekPlanApsAtom)
  return aps.map((a) => a.value)
})
export const ekPlanAddApAtom = atom(
  null,
  (get, set, ap: { value: string; label: string }) => {
    const current = get(ekPlanApsAtom)
    set(ekPlanApsAtom, [...current, ap])
  },
)
export const ekPlanRemoveApAtom = atom(
  null,
  (get, set, ap: { value: string; label: string }) => {
    const current = get(ekPlanApsAtom)
    set(
      ekPlanApsAtom,
      current.filter((a) => a.value !== ap.value),
    )
  },
)

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
export const ekPlanToggleFieldAtom = atom(null, (get, set, field: string) => {
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
export const ekPlanAddFieldAtom = atom(null, (get, set, field: string) => {
  const current = get(ekPlanFieldsAtom)
  const unique = [...new Set([...current, field])]
  set(ekPlanFieldsAtom, unique)
})
export const ekPlanRemoveFieldAtom = atom(null, (get, set, field: string) => {
  const current = get(ekPlanFieldsAtom)
  set(
    ekPlanFieldsAtom,
    current.filter((f) => f !== field),
  )
})

// EkPlan hovered
export const ekPlanHoveredAtom = atom<{
  year: number | null
  tpopId: string | null
}>({
  year: null,
  tpopId: null,
})
export const ekPlanSetHoveredYearAtom = atom(
  null,
  (get, set, val: number | null) => {
    const current = get(ekPlanHoveredAtom)
    set(ekPlanHoveredAtom, { ...current, year: val })
  },
)
export const ekPlanSetHoveredTpopIdAtom = atom(
  null,
  (get, set, val: string | null) => {
    const current = get(ekPlanHoveredAtom)
    set(ekPlanHoveredAtom, { ...current, tpopId: val })
  },
)
export const ekPlanResetHoveredAtom = atom(null, (_get, set) => {
  set(ekPlanHoveredAtom, { year: null, tpopId: null })
})

// EkPlan data loading
export const ekPlanApsDataLoadingAtom = atom(true)

// EkPlan filters
export const ekPlanFilterApAtom = atom<string | null>(null)
export const ekPlanFilterPopNrAtom = atom<number | null>(null)
export const ekPlanFilterPopNameAtom = atom<string | null>(null)
export const ekPlanFilterPopStatusAtom = atom([100, 101, 200, 201, 202, 300])
export const ekPlanFilterNrAtom = atom<number | null>(null)
export const ekPlanFilterGemeindeAtom = atom<string | null>(null)
export const ekPlanFilterFlurnameAtom = atom<string | null>(null)
export const ekPlanFilterStatusAtom = atom([100, 101, 200, 201, 202, 300])
export const ekPlanFilterBekanntSeitAtom = atom<number | null>(null)
export const ekPlanFilterLv95XAtom = atom<number | null>(null)
export const ekPlanFilterLv95YAtom = atom<number | null>(null)
export const ekPlanFilterEkfKontrolleurAtom = atom<string | null>(null)
export const ekPlanFilterEkAbrechnungstypAtom = atom<string | null>(null)
export const ekPlanFilterEkfrequenzAtom = atom<string | null>(null)
export const ekPlanFilterEkfrequenzStartjahrAtom = atom<number | null>(null)
export const ekPlanFilterEkfrequenzAbweichendAtom = atom(false)
export const ekPlanFilterEkfrequenzEmptyAtom = atom(false)
export const ekPlanFilterEkfrequenzStartjahrEmptyAtom = atom(false)
export const ekPlanFilterAnsiedlungYearAtom = atom<number | null>(null)
export const ekPlanFilterKontrolleYearAtom = atom<number | null>(null)
export const ekPlanFilterEkplanYearAtom = atom<number | null>(null)

export const ekPlanSetFilterApAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterApAtom, val)
  },
)
export const ekPlanSetFilterPopNrAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterPopNrAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterPopNameAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterPopNameAtom, val)
  },
)
export const ekPlanSetFilterPopStatusAtom = atom(
  null,
  (_get, set, val: number[] | null) => {
    set(ekPlanFilterPopStatusAtom, val || [100, 101, 200, 201, 202, 300])
  },
)
export const ekPlanSetFilterNrAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterNrAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterGemeindeAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterGemeindeAtom, val)
  },
)
export const ekPlanSetFilterFlurnameAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterFlurnameAtom, val)
  },
)
export const ekPlanSetFilterStatusAtom = atom(
  null,
  (_get, set, val: number[] | null) => {
    set(ekPlanFilterStatusAtom, val || [100, 101, 200, 201, 202, 300])
  },
)
export const ekPlanSetFilterBekanntSeitAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterBekanntSeitAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterLv95XAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterLv95XAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterLv95YAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterLv95YAtom, val ? +val : null)
  },
)
// keep this setter as a map is used to set all filters at once and ekfKontrolleur is part of the map
export const ekPlanSetFilterEkfKontrolleurAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterEkfKontrolleurAtom, val)
  },
)
export const ekPlanSetFilterEkAbrechnungstypAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterEkAbrechnungstypAtom, val)
  },
)
export const ekPlanSetFilterEkfrequenzAtom = atom(
  null,
  (_get, set, val: string | null) => {
    set(ekPlanFilterEkfrequenzAtom, val)
  },
)
export const ekPlanSetFilterEkfrequenzStartjahrAtom = atom(
  null,
  (_get, set, val: string | number | null) => {
    set(ekPlanFilterEkfrequenzStartjahrAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterEkfrequenzAbweichendAtom = atom(
  null,
  (_get, set, val: boolean) => {
    set(ekPlanFilterEkfrequenzAbweichendAtom, val)
  },
)
export const ekPlanSetFilterEmptyEkfrequenzAtom = atom(
  null,
  (_get, set, val: boolean) => {
    set(ekPlanFilterEkfrequenzEmptyAtom, val)
  },
)
export const ekPlanSetFilterAnsiedlungYearAtom = atom(
  null,
  (_get, set, val: number | null) => {
    set(ekPlanFilterAnsiedlungYearAtom, val)
  },
)
export const ekPlanSetFilterKontrolleYearAtom = atom(
  null,
  (_get, set, val: number | null) => {
    set(ekPlanFilterKontrolleYearAtom, val)
  },
)
export const ekPlanSetFilterEkplanYearAtom = atom(
  null,
  (_get, set, val: number | null) => {
    set(ekPlanFilterEkplanYearAtom, val)
  },
)
export const ekPlanSetFilterEmptyEkfrequenzStartjahrAtom = atom(
  null,
  (_get, set, val: boolean) => {
    set(ekPlanFilterEkfrequenzStartjahrEmptyAtom, val)
  },
)

// EkPlan pastYears
export const ekPlanPastYearsAtom = atom(5)

// EkPlan volatile state
export const ekPlanYearMenuAnchorAtom = atom(null)

const initialYearClicked = {
  year: null,
  tpopId: null,
  title: null,
  ekPlan: false,
  ekfPlan: false,
}
export const ekPlanYearClickedAtom = atom(initialYearClicked)
export const ekPlanCloseYearCellMenuAtom = atom(null, (_get, set) => {
  set(ekPlanYearMenuAnchorAtom, null)
  set(ekPlanYearClickedAtom, initialYearClicked)
})

// shape of the EkplanAp query result (see src/components/EkPlan/index.tsx)
export interface EkPlanApsData {
  allAps?: {
    nodes: {
      id: string
      ekzaehleinheitsByApId?: {
        nodes?: {
          tpopkontrzaehlEinheitWerteByZaehleinheitId?: {
            code?: string | null
            text?: string | null
          }
        }[]
      }
    }[]
  }
}

export const ekPlanApsDataAtom = atom<EkPlanApsData | undefined>(undefined)

// EkPlan einheitsByAp computed value
export const ekPlanEinheitsByApAtom = atom((get) => {
  const apsData = get(ekPlanApsDataAtom)
  const nodes = apsData?.allAps?.nodes ?? []
  const e: Record<string, (string | null | undefined)[]> = {}
  nodes.forEach((node) => {
    e[node.id] = (node?.ekzaehleinheitsByApId?.nodes ?? []).map(
      (o) => o.tpopkontrzaehlEinheitWerteByZaehleinheitId?.code,
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

export const setSortedBeobFieldsAtom = atom(
  null,
  (_get, set, val: (string | undefined)[]) => {
    set(
      sortedBeobFieldsAtom,
      val.filter((v): v is string => !!v),
    )
  },
)

// exportFileType
export const exportFileTypeAtom = atomWithStorage('exportFileType', 'xlsx')

export const setExportFileTypeAtom = atom(null, (_get, set, val: string) => {
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
  return (atomMap as Record<string, unknown>)[table]
}
