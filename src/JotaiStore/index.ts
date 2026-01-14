import { createStore, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { constants } from '../modules/constants.ts'

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
