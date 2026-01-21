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
// lets not save this in storage - is only used while printing
export const mapHideControlsAtom = atom(false)
export const setMapHideControlsAtom = atom(
  (get) => get(mapHideControlsAtom),
  (get, set, value) => set(mapHideControlsAtom, value),
)
export const mapMouseCoordinatesAtom = atom({ x: 2683000, y: 1247500 })
export const setMapMouseCoordinatesAtom = atom(
  (get) => get(mapMouseCoordinatesAtom),
  (get, set, { x, y }) => set(mapMouseCoordinatesAtom, { x, y }),
)
// setting bounds works imperatively with map.fitBounds since v3
// but keeping bounds in store as last used bounds will be re-applied on next map opening
export const mapBoundsAtom = atomWithStorage('mapBounds', [
  [47.159, 8.354],
  [47.696, 8.984],
])
export const setMapBoundsAtom = atom(
  (get) => get(mapBoundsAtom),
  (get, set, value) => set(mapBoundsAtom, value),
)
export const idOfTpopBeingLocalizedAtom = atom<string | null>(null)
export const setIdOfTpopBeingLocalizedAtom = atom(
  (get) => get(idOfTpopBeingLocalizedAtom),
  (get, set, value) => set(idOfTpopBeingLocalizedAtom, value),
)
export const mapShowApfLayersForMultipleApsAtom = atomWithStorage(
  'mapShowApfLayersForMultipleAps',
  false,
)
export const setMapShowApfLayersForMultipleApsAtom = atom(
  (get) => get(mapShowApfLayersForMultipleApsAtom),
  (get, set, value) => set(mapShowApfLayersForMultipleApsAtom, value),
)
// make this a regular atom so we can change the default value
export const mapOverlaysAtom = atom([
  { label: 'Markierungen', value: 'Markierungen' },
  { label: 'Detailpläne', value: 'Detailplaene' },
  {
    label: 'Massnahmenpläne der aktiven Art, Flächen',
    value: 'MassnahmenFlaechen',
  },
  {
    label: 'Massnahmenpläne der aktiven Art, Linien',
    value: 'MassnahmenLinien',
  },
  {
    label: 'Massnahmenpläne der aktiven Art, Punkte',
    value: 'MassnahmenPunkte',
  },
  { label: 'NS-Gebiete Betreuung', value: 'Betreuungsgebiete' },
  { label: 'ZH Übersichtsplan', value: 'ZhUep' },
  { label: 'Gemeinden', value: 'Gemeinden' },
  { label: 'SVO grau', value: 'ZhSvoGrey' },
  { label: 'SVO farbig', value: 'ZhSvoColor' },
  { label: 'Pflegeplan', value: 'ZhPflegeplan' },
  {
    label: 'Lebensraum- und Vegetationskartierungen',
    value: 'ZhLrVegKartierungen',
  },
  { label: 'Wälder: lichte', value: 'ZhLichteWaelder' },
  { label: 'Wälder: Vegetation', value: 'ZhWaelderVegetation' },
  { label: 'Forstreviere (WMS)', value: 'ZhForstreviereWms' },
  { label: 'Forstreviere. Stand: 2025.04.10', value: 'Forstreviere' },
])
export const setMapOverlaysAtom = atom(
  (get) => get(mapOverlaysAtom),
  (get, set, value) => set(mapOverlaysAtom, value),
)
export const mapActiveOverlaysAtom = atomWithStorage('mapActiveOverlays', [])
export const setMapActiveOverlaysAtom = atom(
  (get) => get(mapActiveOverlaysAtom),
  (get, set, value) => set(mapActiveOverlaysAtom, value),
)
export const mapActiveBaseLayerAtom = atomWithStorage(
  'mapActiveBaseLayer',
  'OsmColor',
)
export const setMapActiveBaseLayerAtom = atom(
  (get) => get(mapActiveBaseLayerAtom),
  (get, set, value) => set(mapActiveBaseLayerAtom, value),
)
export const mapPopIconAtom = atomWithStorage(
  'mapPopIcon',
  'statusGroupSymbols',
)
export const setMapPopIconAtom = atom(
  (get) => get(mapPopIconAtom),
  (get, set, value) => set(mapPopIconAtom, value),
)
export const mapTpopIconAtom = atomWithStorage(
  'mapTpopIcon',
  'statusGroupSymbols',
)
export const setMapTpopIconAtom = atom(
  (get) => get(mapTpopIconAtom),
  (get, set, value) => set(mapTpopIconAtom, value),
)
export const mapPopLabelAtom = atomWithStorage('mapPopLabel', 'nr')
export const setMapPopLabelAtom = atom(
  (get) => get(mapPopLabelAtom),
  (get, set, value) => set(mapPopLabelAtom, value),
)
export const mapTpopLabelAtom = atomWithStorage('mapTpopLabel', 'nr')
export const setMapTpopLabelAtom = atom(
  (get) => get(mapTpopLabelAtom),
  (get, set, value) => set(mapTpopLabelAtom, value),
)
export const mapBeobDetailsOpenAtom = atom(false)
export const setMapBeobDetailsOpenAtom = atom(
  (get) => get(mapBeobDetailsOpenAtom),
  (get, set, value) => set(mapBeobDetailsOpenAtom, value),
)
// apfloraLayers is not stored - needs to update when code changes
export const mapApfloraLayersAtom = atom([
  { label: 'Populationen', value: 'pop' },
  { label: 'Teil-Populationen', value: 'tpop' },
  { label: 'Beobachtungen: zugeordnet', value: 'beobZugeordnet' },
  { label: 'Beobachtungen: nicht beurteilt', value: 'beobNichtBeurteilt' },
  { label: 'Beobachtungen: nicht zuzuordnen', value: 'beobNichtZuzuordnen' },
  { label: 'Zuordnungs-Linien', value: 'beobZugeordnetAssignPolylines' },
])
export const mapActiveApfloraLayersAtom = atomWithStorage<string[]>(
  'activeApfloraLayers',
  [],
)
export const setMapActiveApfloraLayersAtom = atom(
  (get) => get(mapActiveApfloraLayersAtom),
  (get, set, value) => set(mapActiveApfloraLayersAtom, value),
)
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

// Assigning Beob
export const assigningBeobAtom = atom(false)
export const setAssigningBeobAtom = atom(null, (get, set, val) => {
  set(assigningBeobAtom, val)
})

// Choose AP dialogs
export const openChooseApToCopyEkfrequenzsFromAtom = atom(false)
export const setOpenChooseApToCopyEkfrequenzsFromAtom = atom(
  null,
  (get, set, val) => {
    set(openChooseApToCopyEkfrequenzsFromAtom, val)
  },
)
export const openChooseApToCopyErfkritsFromAtom = atom(false)
export const setOpenChooseApToCopyErfkritsFromAtom = atom(
  null,
  (get, set, val) => {
    set(openChooseApToCopyErfkritsFromAtom, val)
  },
)

// Print state
export const isPrintAtom = atom(false)
export const setIsPrintAtom = atom(null, (get, set, val) => {
  set(isPrintAtom, val)
})
export const isEkfSinglePrintAtom = atom(false)
export const setIsEkfSinglePrintAtom = atom(null, (get, set, val) => {
  set(isEkfSinglePrintAtom, val)
})

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

// deletedDatasets atom and actions
export const deletedDatasetsAtom = atom([])

export const setDeletedDatasetsAtom = atom(
  (get) => get(deletedDatasetsAtom),
  (get, set, val) => {
    set(deletedDatasetsAtom, val)
  },
)

export const addDeletedDatasetAtom = atom(
  (get) => get(deletedDatasetsAtom),
  (get, set, val) => {
    const current = get(deletedDatasetsAtom)
    set(deletedDatasetsAtom, [...current, val])
  },
)

export const removeDeletedDatasetByIdAtom = atom(
  (get) => get(deletedDatasetsAtom),
  (get, set, id) => {
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
  (get, set, val) => {
    set(showDeletionsAtom, val)
  },
)

// EkPlan atoms
export const ekPlanShowEkAtom = atom(true)
export const ekPlanShowEkfAtom = atom(true)
export const ekPlanShowCountAtom = atom(true)
export const ekPlanShowEkCountAtom = atom(true)
export const ekPlanShowMassnAtom = atom(true)

export const ekPlanSetShowEkAtom = atom(null, (get, set, val) => {
  set(ekPlanShowEkAtom, val)
})
export const ekPlanSetShowEkfAtom = atom(null, (get, set, val) => {
  set(ekPlanShowEkfAtom, val)
})
export const ekPlanSetShowCountAtom = atom(null, (get, set, val) => {
  set(ekPlanShowCountAtom, val)
})
export const ekPlanSetShowEkCountAtom = atom(null, (get, set, val) => {
  set(ekPlanShowEkCountAtom, val)
})
export const ekPlanSetShowMassnAtom = atom(null, (get, set, val) => {
  set(ekPlanShowMassnAtom, val)
})

// EkPlan aps
export const ekPlanApsAtom = atom([])
export const ekPlanApValuesAtom = atom((get) => {
  const aps = get(ekPlanApsAtom)
  return aps.map((a) => a.value)
})
export const ekPlanAddApAtom = atom(null, (get, set, ap) => {
  const current = get(ekPlanApsAtom)
  set(ekPlanApsAtom, [...current, ap])
})
export const ekPlanRemoveApAtom = atom(null, (get, set, ap) => {
  const current = get(ekPlanApsAtom)
  set(
    ekPlanApsAtom,
    current.filter((a) => a.value !== ap.value),
  )
})

// EkPlan fields
const defaultFields = [
  'ap',
  'popNr',
  'nr',
  'ekfrequenz',
  'ekfrequenzStartjahr',
  'ekfrequenzAbweichend',
]
export const ekPlanFieldsAtom = atom(defaultFields)
export const ekPlanSetFieldsAtom = atom(null, (get, set, fields) => {
  set(ekPlanFieldsAtom, fields)
})
export const ekPlanToggleFieldAtom = atom(null, (get, set, field) => {
  const current = get(ekPlanFieldsAtom)
  if (current.includes(field)) {
    set(
      ekPlanFieldsAtom,
      current.filter((f) => f !== field),
    )
  } else {
    const unique = [...new Set([...current, field])]
    set(ekPlanFieldsAtom, unique)
  }
})
export const ekPlanAddFieldAtom = atom(null, (get, set, field) => {
  const current = get(ekPlanFieldsAtom)
  const unique = [...new Set([...current, field])]
  set(ekPlanFieldsAtom, unique)
})
export const ekPlanRemoveFieldAtom = atom(null, (get, set, field) => {
  const current = get(ekPlanFieldsAtom)
  set(
    ekPlanFieldsAtom,
    current.filter((f) => f !== field),
  )
})

// EkPlan hovered
export const ekPlanHoveredAtom = atom({ year: null, tpopId: null })
export const ekPlanSetHoveredAtom = atom(null, (get, set, val) => {
  set(ekPlanHoveredAtom, val)
})
export const ekPlanSetHoveredYearAtom = atom(null, (get, set, val) => {
  const current = get(ekPlanHoveredAtom)
  set(ekPlanHoveredAtom, { ...current, year: val })
})
export const ekPlanSetHoveredTpopIdAtom = atom(null, (get, set, val) => {
  const current = get(ekPlanHoveredAtom)
  set(ekPlanHoveredAtom, { ...current, tpopId: val })
})
export const ekPlanResetHoveredAtom = atom(null, (get, set) => {
  set(ekPlanHoveredAtom, { year: null, tpopId: null })
})

// EkPlan data loading
export const ekPlanApsDataLoadingAtom = atom(true)
export const ekPlanSetApsDataLoadingAtom = atom(null, (get, set, val) => {
  set(ekPlanApsDataLoadingAtom, val)
})

// EkPlan filters
export const ekPlanFilterApAtom = atom(null)
export const ekPlanFilterPopNrAtom = atom(null)
export const ekPlanFilterPopNameAtom = atom(null)
export const ekPlanFilterPopStatusAtom = atom([100, 101, 200, 201, 202, 300])
export const ekPlanFilterNrAtom = atom(null)
export const ekPlanFilterGemeindeAtom = atom(null)
export const ekPlanFilterFlurnameAtom = atom(null)
export const ekPlanFilterStatusAtom = atom([100, 101, 200, 201, 202, 300])
export const ekPlanFilterBekanntSeitAtom = atom(null)
export const ekPlanFilterLv95XAtom = atom(null)
export const ekPlanFilterLv95YAtom = atom(null)
export const ekPlanFilterEkfKontrolleurAtom = atom(null)
export const ekPlanFilterEkAbrechnungstypAtom = atom(null)
export const ekPlanFilterEkfrequenzAtom = atom(null)
export const ekPlanFilterEkfrequenzStartjahrAtom = atom(null)
export const ekPlanFilterEkfrequenzAbweichendAtom = atom(false)
export const ekPlanFilterEkfrequenzEmptyAtom = atom(false)
export const ekPlanFilterEkfrequenzStartjahrEmptyAtom = atom(false)
export const ekPlanFilterAnsiedlungYearAtom = atom(null)
export const ekPlanFilterKontrolleYearAtom = atom(null)
export const ekPlanFilterEkplanYearAtom = atom(null)

export const ekPlanSetFilterApAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterApAtom, val)
})
export const ekPlanSetFilterPopNrAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterPopNrAtom, val ? +val : null)
})
export const ekPlanSetFilterPopNameAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterPopNameAtom, val)
})
export const ekPlanSetFilterPopStatusAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterPopStatusAtom, val || [100, 101, 200, 201, 202, 300])
})
export const ekPlanSetFilterNrAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterNrAtom, val ? +val : null)
})
export const ekPlanSetFilterGemeindeAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterGemeindeAtom, val)
})
export const ekPlanSetFilterFlurnameAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterFlurnameAtom, val)
})
export const ekPlanSetFilterStatusAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterStatusAtom, val || [100, 101, 200, 201, 202, 300])
})
export const ekPlanSetFilterBekanntSeitAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterBekanntSeitAtom, val ? +val : null)
})
export const ekPlanSetFilterLv95XAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterLv95XAtom, val ? +val : null)
})
export const ekPlanSetFilterLv95YAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterLv95YAtom, val ? +val : null)
})
export const ekPlanSetFilterEkfKontrolleurAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterEkfKontrolleurAtom, val)
})
export const ekPlanSetFilterEkAbrechnungstypAtom = atom(
  null,
  (get, set, val) => {
    set(ekPlanFilterEkAbrechnungstypAtom, val)
  },
)
export const ekPlanSetFilterEkfrequenzAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterEkfrequenzAtom, val)
})
export const ekPlanSetFilterEkfrequenzStartjahrAtom = atom(
  null,
  (get, set, val) => {
    set(ekPlanFilterEkfrequenzStartjahrAtom, val ? +val : null)
  },
)
export const ekPlanSetFilterEkfrequenzAbweichendAtom = atom(
  null,
  (get, set, val) => {
    set(ekPlanFilterEkfrequenzAbweichendAtom, val)
  },
)
export const ekPlanSetFilterEmptyEkfrequenzAtom = atom(
  null,
  (get, set, val) => {
    set(ekPlanFilterEkfrequenzEmptyAtom, val)
  },
)
export const ekPlanSetFilterAnsiedlungYearAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterAnsiedlungYearAtom, val)
})
export const ekPlanSetFilterKontrolleYearAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterKontrolleYearAtom, val)
})
export const ekPlanSetFilterEkplanYearAtom = atom(null, (get, set, val) => {
  set(ekPlanFilterEkplanYearAtom, val)
})
export const ekPlanSetFilterEmptyEkfrequenzStartjahrAtom = atom(
  null,
  (get, set, val) => {
    set(ekPlanFilterEkfrequenzStartjahrEmptyAtom, val)
  },
)

// EkPlan pastYears
export const ekPlanPastYearsAtom = atom(5)
export const ekPlanSetPastYearsAtom = atom(null, (get, set, val) => {
  set(ekPlanPastYearsAtom, val)
})

// EkPlan volatile state
export const ekPlanYearMenuAnchorAtom = atom(null)
export const ekPlanSetYearMenuAnchorAtom = atom(null, (get, set, anchor) => {
  set(ekPlanYearMenuAnchorAtom, anchor)
})

const initialYearClicked = {
  year: null,
  tpopId: null,
  title: null,
  ekPlan: false,
  ekfPlan: false,
}
export const ekPlanYearClickedAtom = atom(initialYearClicked)
export const ekPlanSetYearClickedAtom = atom(null, (get, set, val) => {
  set(ekPlanYearClickedAtom, val)
})
export const ekPlanCloseYearCellMenuAtom = atom(null, (get, set) => {
  set(ekPlanYearMenuAnchorAtom, null)
  set(ekPlanYearClickedAtom, initialYearClicked)
})

export const ekPlanApsDataAtom = atom([])
export const ekPlanSetApsDataAtom = atom(null, (get, set, val) => {
  set(ekPlanApsDataAtom, val)
})

// EkPlan einheitsByAp computed value
export const ekPlanEinheitsByApAtom = atom((get) => {
  const apsData = get(ekPlanApsDataAtom)
  const nodes = apsData?.allAps?.nodes ?? []
  const e = {}
  nodes.forEach((node) => {
    e[node.id] = (node?.ekzaehleinheitsByApId?.nodes ?? []).map(
      (o) => o.tpopkontrzaehlEinheitWerteByZaehleinheitId.code,
    )
  })
  return e
})

// sortedBeobFields
const defaultSortedBeobFields = [
  'taxon',
  'ESPECE',
  'presence',
  'PRESENCE',
  'xy_radius',
  'abundance_cat',
  'abundance',
  'CAT_ABONDANCE_1',
  'XY_PRECISION',
  'observers',
  'NOM_PERSONNE_OBS',
  'PRENOM_PERSONNE_OBS',
  'obs_day',
  'obs_month',
  'obs_year',
  'J_NOTE',
  'M_NOTE',
  'A_NOTE',
  'remarks',
  'locality_descript',
  'DESC_LOCALITE',
  'DESC_LOCALITE_',
  'municipality',
  'canton',
  'NOM_COMMUNE',
  'CO_CANTON',
  'interpretation_note',
  'doubt_status',
  'phenology_code',
  'count_unit',
  'obs_type',
  'original_taxon',
  'taxon_expert',
  'determinavit_cf',
  'specimen_type',
  'NOM_ORIGINAL',
  'NOM_COMPLET',
  'introduction',
  'DETERMINAVIT_CF',
  'DETERMINAVIT_CF_',
  'x_swiss',
  'y_swiss',
  'COORDONNEE_FED_E',
  'COORDONNEE_FED_N',
  'FNS_XGIS',
  'FNS_YGIS',
  'STATION',
]

// needs to update when defaultSortedBeobFields is changed - thus not with storage
export const sortedBeobFieldsAtom = atom(defaultSortedBeobFields)

export const setSortedBeobFieldsAtom = atom(null, (get, set, val) => {
  set(
    sortedBeobFieldsAtom,
    val.filter((v) => !!v),
  )
})

// exportFileType
export const exportFileTypeAtom = atomWithStorage('exportFileType', 'xlsx')

export const setExportFileTypeAtom = atom(null, (get, set, val) => {
  set(exportFileTypeAtom, val)
})
