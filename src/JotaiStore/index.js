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
