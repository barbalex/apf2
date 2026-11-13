// tree navigation: active node array, open nodes, tree2 (iframe), label filter
import { atom } from 'jotai'
import type { Getter } from 'jotai/vanilla'
import { atomWithStorage } from 'jotai/utils'
import { isEqual } from 'es-toolkit'
import { validate as isUuid } from 'uuid'

import { createUnsubscribedStorage } from './store.ts'

const isNonNilUuid = (value: unknown): value is string =>
  typeof value === 'string' && isUuid(value)

// localStorage-backed atoms are typed via their initial value, but jotai's
// untyped JSON storage makes getters resolve to `T | Promise<T>`.
// localStorage access is synchronous, so this cast is safe.
export const getNodeLabelFilter = (get: Getter): TreeNodeLabelFilter =>
  get(treeNodeLabelFilterAtom) as TreeNodeLabelFilter

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

// tree2 (the second tree pane) lives in ./tree2.ts

// treeLastTouchedNode - tracks the last touched tree node for scrolling
export const treeLastTouchedNodeAtom = atom<(string | number)[]>([])
export const setTreeLastTouchedNodeAtom = atom(
  (get) => get(treeLastTouchedNodeAtom),
  (_get, set, value: (string | number)[]) =>
    set(treeLastTouchedNodeAtom, value),
)

// treeShowPopIcon - controls whether to show pop icons in tree
export const treeShowPopIconAtom = atomWithStorage(
  'treeShowPopIcon',
  true,
  undefined,
  { getOnInit: true },
)
export const toggleTreeShowPopIconAtom = atom(
  (get) => get(treeShowPopIconAtom),
  (get, set) => set(treeShowPopIconAtom, !get(treeShowPopIconAtom)),
)
export const setTreeShowPopIconAtom = atom(
  (get) => get(treeShowPopIconAtom),
  (_get, set, value: boolean) => set(treeShowPopIconAtom, value),
)

// treeShowTpopIcon - controls whether to show tpop icons in tree
export const treeShowTpopIconAtom = atomWithStorage(
  'treeShowTpopIcon',
  true,
  undefined,
  { getOnInit: true },
)
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
  { getOnInit: true },
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
