// desktop/mobile view mode with manual override and hysteresis
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { constants } from '../modules/constants.ts'

export const enforceDesktopNavigationAtom = atomWithStorage(
  'enforceDesktopNavigation',
  false,
  undefined,
  { getOnInit: true },
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
  undefined,
  { getOnInit: true },
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
export const isDesktopViewAtom = atomWithStorage(
  'isDesktopView',
  false,
  undefined,
  { getOnInit: true },
)
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
export const showBookmarksMenuAtom = atomWithStorage(
  'showBookmarksMenu',
  false,
  undefined,
  { getOnInit: true },
)
export const alwaysShowTreeAtom = atomWithStorage(
  'alwaysShowTree',
  false,
  undefined,
  { getOnInit: true },
)
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
