// ui state: nav-list filter visibility, query client, dialogs, print
import { atom } from 'jotai'
import type { Store } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { QueryClient } from '@tanstack/react-query'

import { atomWithToggleAndStorage, store } from './store.ts'

export const newTpopFromBeobDialogOpenAtom = atomWithStorage(
  'newTpopFromBeobDialogOpen',
  false,
  undefined,
  { getOnInit: true },
)
export const newTpopFromBeobBeobIdAtom = atomWithStorage<string | null>(
  'newTpopFromBeobBeobId',
  null,
  undefined,
  { getOnInit: true },
)

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

/**
 * set shortly after app start;
 * modules using it only run after that
 */
export const getTsQueryClientFromStore = () =>
  store.get(tsQueryClientAtom) as QueryClient

// same for an explicit store (the tree2 pane passes its own)
export const getTsQueryClientFrom = (targetStore: Store) =>
  targetStore.get(tsQueryClientAtom) as QueryClient

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
