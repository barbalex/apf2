import { createStore } from 'jotai'
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
export const alwaysShowTreeAtom = atomWithStorage('alwaysShowTree', false)
