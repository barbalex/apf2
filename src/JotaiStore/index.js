import { createStore, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { constants } from '../modules/constants.js'
import {
  adresse,
  ap,
  apber,
  apberuebersicht,
  assozart,
  ekAbrechnungstypWerte,
  ekfrequenz,
  ekzaehleinheit,
  pop,
  popber,
  popmassnber,
  tpop,
  tpopber,
  tpopkontrzaehlEinheitWerte,
  tpopmassnber,
  user,
} from '../components/shared/fragments.js'
import { ApberrelevantGrund } from '../components/Projekte/TreeContainer/Tree/Root/Werte/ApberrelevantGrundFolder/ApberrelevantGrund.jsx'

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
export const navListFilterIsVisibleAtom = atomWithStorage(
  'navListFilterIsVisible',
  {
    Adressen: false,
    apberrelevantGrundWerte: false,
    ekAbrechnungstypWerte: false,
    tpopkontrzaehlEinheitWerte: false,
    user: false,
    apberuebersicht: false,
    ap: false,
    beobnichtzuzuordnen: false,
    beobnichtbeurteilt: false,
    ekzaehleinheit: false,
    ekfrequenz: false,
    assozart: false,
    apart: false,
    apber: false,
    aperfkrit: false,
    apziel: false,
    apzielber: false,
    pop: false,
    popmassnber: false,
    popber: false,
    tpop: false,
    beobzugeordnet: false,
    tpopber: false,
    tpopekf: false,
    tpopek: false,
    tpopkontrzaehl: false,
    tpopmassnber: false,
    tpopmassn: false,
  },
)
