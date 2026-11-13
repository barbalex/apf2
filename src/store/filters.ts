// the filter cascade: IsFiltered, GqlFilter and DataFilter atoms. Their
// emitted jsonb is compiled server-side by apflora.compile_filter — see
// gqlFilter.test.ts for the pinned contract
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
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
} from '../modules/gqlFilterTypes.ts'

import { initialDataFilterValues } from './initialDataFilterValues.ts'
import { simpleTypes as apType } from './DataFilter/ap.ts'
import { simpleTypes as popType } from './DataFilter/pop.ts'
import { simpleTypes as tpopType } from './DataFilter/tpop.ts'
import { simpleTypes as tpopmassnType } from './DataFilter/tpopmassn.ts'
import {
  initial as initialTpopfeldkontr,
  simpleTypes as tpopfeldkontrType,
} from './DataFilter/tpopfeldkontr.ts'
import {
  initial as initialTpopfreiwkontr,
  simpleTypes as tpopfreiwkontrType,
} from './DataFilter/tpopfreiwkontr.ts'
import { createUnsubscribedStorage, store } from './store.ts'
import {
  getNodeLabelFilter,
  treeActiveNodeArrayAtom,
  treeApIdInActiveNodeArrayAtom,
  treeOpenNodesAtom,
  treeProjIdInActiveNodeArrayAtom,
} from './tree.ts'
import { treeMapFilterAtom } from './map.ts'
import { addNotificationAtom } from './notifications.ts'

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
  (get, set, { table, val }: { table: string; val: unknown }) => {
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
    }: { table: string; key: string; value: unknown; index?: number },
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
