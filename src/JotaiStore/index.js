import { createStore, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const store = createStore()

export const newTpopFromBeobDialogOpenAtom = atomWithStorage(
  'newTpopFromBeobDialogOpen',
  false,
)
export const newTpopFromBeobBeobIdAtom = atomWithStorage(
  'newTpopFromBeobBeobId',
  null,
)
export const listLabelFilterIsIconAtom = atomWithStorage(
  'listLabelFilterIsIcon',
  true,
)
export const alwaysShowBookmarksAtom = atomWithStorage(
  'alwaysShowBookmarks',
  false,
)
export const isDesktopViewAtom = atomWithStorage('isDesktopView', false)
export const isMobileViewAtom = atom((get) => !get(isDesktopViewAtom))
export const hideBookmarksAtom = atom((get) => {
  const isDesktopView = get(isDesktopViewAtom)
  const alwaysShowBookmarks = get(alwaysShowBookmarksAtom)
  const hideBookmarks = isDesktopView && !alwaysShowBookmarks
  return hideBookmarks
})
export const alwaysShowTreeAtom = atomWithStorage('alwaysShowTree', false)
export const hideTreeAtom = atom((get) => {
  const alwaysShowTree = get(alwaysShowTreeAtom)
  const isMobileView = get(isMobileViewAtom)
  const hideTree = !alwaysShowTree && isMobileView
  return hideTree
})
