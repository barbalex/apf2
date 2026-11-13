// deletions: queued toDelete, deleted datasets, clear-all-storage
import { atom } from 'jotai'

import { copyingAtom, copyingBiotopAtom, movingAtom } from './clipboard.ts'
import {
  adresseNavListFilterIsVisibleAtom,
  apartNavListFilterIsVisibleAtom,
  apberNavListFilterIsVisibleAtom,
  apberuebersichtNavListFilterIsVisibleAtom,
  aperfkritNavListFilterIsVisibleAtom,
  apNavListFilterIsVisibleAtom,
  apzielberNavListFilterIsVisibleAtom,
  apzielNavListFilterIsVisibleAtom,
  assozartNavListFilterIsVisibleAtom,
  beobNichtBeurteiltNavListFilterIsVisibleAtom,
  beobNichtZuzuordnenNavListFilterIsVisibleAtom,
  beobZugeordnetNavListFilterIsVisibleAtom,
  docNavListFilterIsVisibleAtom,
  ekAbrechnungstypWerteNavListFilterIsVisibleAtom,
  ekfrequenzNavListFilterIsVisibleAtom,
  ekzaehleinheitNavListFilterIsVisibleAtom,
  erfkritNavListFilterIsVisibleAtom,
  newTpopFromBeobBeobIdAtom,
  newTpopFromBeobDialogOpenAtom,
  popberNavListFilterIsVisibleAtom,
  popmassnberNavListFilterIsVisibleAtom,
  popNavListFilterIsVisibleAtom,
  tpopApberrelevantGrundWerteNavListFilterIsVisibleAtom,
  tpopberNavListFilterIsVisibleAtom,
  tpopkontrNavListFilterIsVisibleAtom,
  tpopkontrzaehlEinheitWerteNavListFilterIsVisibleAtom,
  tpopkontrzaehlNavListFilterIsVisibleAtom,
  tpopmassnberNavListFilterIsVisibleAtom,
  tpopmassnNavListFilterIsVisibleAtom,
  tpopNavListFilterIsVisibleAtom,
  userNavListFilterIsVisibleAtom,
  zielNavListFilterIsVisibleAtom,
} from './ui.ts'
import {
  alwaysShowTreeAtom,
  enforceDesktopNavigationAtom,
  enforceMobileNavigationAtom,
  isDesktopViewAtom,
  showBookmarksMenuAtom,
} from './viewMode.ts'
import { userAtom } from './user.ts'

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
