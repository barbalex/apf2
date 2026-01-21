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

export const tsQueryClientAtom = atom(null)
export const apolloClientAtom = atom(null)

// Notifications
export const notificationsAtom = atom([])

export const addNotificationAtom = atom(null, (get, set, note) => {
  const notifications = get(notificationsAtom)
  const key = note.options?.key ?? new Date().getTime() + Math.random()
  set(notificationsAtom, [
    ...notifications,
    {
      key,
      ...note,
    },
  ])
})

export const removeNotificationAtom = atom(null, (get, set, key) => {
  const notifications = get(notificationsAtom)
  set(
    notificationsAtom,
    notifications.filter((n) => n.key !== key),
  )
})

// navigate function atom
// Store as object because Jotai doesn't handle bare functions well
// The setter accepts a function and wraps it in { fn: function }
const navigateObjectBaseAtom = atom(undefined)
export const navigateObjectAtom = atom(
  (get) => get(navigateObjectBaseAtom),
  (get, set, navigateFunction) => {
    set(navigateObjectBaseAtom, { fn: navigateFunction })
  },
)
export const navigateAtom = atom((get) => get(navigateObjectBaseAtom)?.fn)

// User
export const userAtom = atomWithStorage('user', {
  name: '',
  token: null,
  id: null,
})

export const userNameAtom = atom((get) => get(userAtom).name)
export const userTokenAtom = atom((get) => get(userAtom).token)
export const userIdAtom = atom((get) => get(userAtom).id)

export const setUserAtom = atom(null, (get, set, newUser) => {
  set(userAtom, newUser)
})

export const removeUserAtom = atom(null, (get, set) => {
  set(userAtom, {
    name: '',
    token: null,
    id: null,
  })
})

// Copying
export const copyingAtom = atom({
  table: null,
  id: null,
  label: null,
  withNextLevel: false,
})

export const setCopyingAtom = atom(
  null,
  (get, set, { table, id, label, withNextLevel }) => {
    set(copyingAtom, { table, id, label, withNextLevel })
  },
)

export const copyingBiotopAtom = atom({
  id: null,
  label: null,
})

export const setCopyingBiotopAtom = atom(null, (get, set, { id, label }) => {
  set(copyingBiotopAtom, { id, label })
})

export const movingAtom = atom({
  table: null,
  id: null,
  label: null,
  toTable: null,
  fromParentId: null,
})

export const setMovingAtom = atom(
  null,
  (get, set, { table, id, label, toTable, fromParentId }) => {
    set(movingAtom, { table, id, label, toTable, fromParentId })
  },
)

export const clearAllStorageAtom = atom(null, (get, set) => {
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
export const toDeleteAtom = atom({
  table: null,
  id: null,
  label: null,
  url: null,
  afterDeletionHook: null,
})

export const setToDeleteAtom = atom(
  (get) => get(toDeleteAtom),
  (get, set, { table, id, label, url, afterDeletionHook }) => {
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
  (get, set) => {
    set(toDeleteAtom, {
      table: null,
      id: null,
      label: null,
      url: null,
      afterDeletionHook: null,
    })
  },
)
