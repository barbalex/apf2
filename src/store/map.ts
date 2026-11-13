// map state: view, bounds, overlays, apflora layers, drawn-geometry filter
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const treeMapFilterAtom = atom(undefined)
export const treeEmptyMapFilterAtom = atom(null, (_get, set) => {
  set(treeMapFilterAtom, undefined)
})

// lets not save this in storage - is only used while printing
export const mapHideControlsAtom = atom(false)
export const setMapHideControlsAtom = atom(
  (get) => get(mapHideControlsAtom),
  (_get, set, value: boolean) => set(mapHideControlsAtom, value),
)
export const mapMouseCoordinatesAtom = atom({ x: 2683000, y: 1247500 })
export const setMapMouseCoordinatesAtom = atom(
  (get) => get(mapMouseCoordinatesAtom),
  (_get, set, { x, y }: { x: number; y: number }) =>
    set(mapMouseCoordinatesAtom, { x, y }),
)
// setting bounds works imperatively with map.fitBounds since v3
// kept in store as a fallback for map openings before mapView existed
// (see mapViewAtom for the exact view that is restored)
export const mapBoundsAtom = atomWithStorage(
  'mapBounds',
  [
    [47.159, 8.354],
    [47.696, 8.984],
  ],
  undefined,
  { getOnInit: true },
)
export const setMapBoundsAtom = atom(
  (get) => get(mapBoundsAtom),
  (_get, set, value: number[][]) => set(mapBoundsAtom, value),
)
// exact view of the last open map, restored when the map is re-opened.
// center/zoom (not bounds) because restoring via fitBounds re-derives the zoom
// from the container size and can be off by a zoom level
export interface MapView {
  center: { lat: number; lng: number }
  zoom: number
}
export const mapViewAtom = atomWithStorage<MapView | undefined>(
  'mapView',
  undefined,
  undefined,
  { getOnInit: true },
)
export const idOfTpopBeingLocalizedAtom = atom<string | null>(null)
export const setIdOfTpopBeingLocalizedAtom = atom(
  (get) => get(idOfTpopBeingLocalizedAtom),
  (_get, set, value: string | null) => set(idOfTpopBeingLocalizedAtom, value),
)
export const mapShowApfLayersForMultipleApsAtom = atomWithStorage(
  'mapShowApfLayersForMultipleAps',
  false,
  undefined,
  { getOnInit: true },
)
export const setMapShowApfLayersForMultipleApsAtom = atom(
  (get) => get(mapShowApfLayersForMultipleApsAtom),
  (_get, set, value: boolean) => set(mapShowApfLayersForMultipleApsAtom, value),
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
  { label: 'ZH Übersichtsplan', value: 'ZhUepOverlay' },
  { label: 'Gemeinden', value: 'Gemeinden' },
  { label: 'Schutzanordnungen', value: 'ZhSvo' },
  { label: 'Pflegeplan aktuelles Jahr', value: 'ZhPflegeplanAJ' },
  { label: 'Pflegeplan vergangenes Jahr', value: 'ZhPflegeplanVJ' },
  { label: 'Pflegeplan vor-vergangenes Jahr', value: 'ZhPflegeplanVVJ' },
  {
    label: 'Lebensraum- und Vegetationskartierungen',
    value: 'ZhLrVegKartierungen',
  },
  { label: 'Wälder: lichte', value: 'ZhLichteWaelder' },
  { label: 'Wälder: Vegetation', value: 'ZhWaelderVegetation' },
  { label: 'Forstreviere', value: 'ZhForstreviereWms' },
])
export const setMapOverlaysAtom = atom(
  (get) => get(mapOverlaysAtom),
  (_get, set, value: { label: string; value: string }[]) =>
    set(mapOverlaysAtom, value),
)
// migrate overlay names that were renamed
// ('ZhUep' overlay became 'ZhUepOverlay' to not conflict with the base layer)
// needs to happen before the atom reads localStorage on init
// see: https://github.com/barbalex/apf2/issues/816
try {
  const storedActiveOverlays = localStorage.getItem('mapActiveOverlays')
  if (storedActiveOverlays) {
    const parsedActiveOverlays = JSON.parse(storedActiveOverlays)
    if (Array.isArray(parsedActiveOverlays)) {
      const migratedActiveOverlays = [
        ...new Set(
          parsedActiveOverlays.map((o) => (o === 'ZhUep' ? 'ZhUepOverlay' : o)),
        ),
      ]
      localStorage.setItem(
        'mapActiveOverlays',
        JSON.stringify(migratedActiveOverlays),
      )
    }
  }
} catch {
  // ignore malformed storage
}
export const mapActiveOverlaysAtom = atomWithStorage<string[]>(
  'mapActiveOverlays',
  [],
  undefined,
  { getOnInit: true },
)
export const setMapActiveOverlaysAtom = atom(
  (get) => get(mapActiveOverlaysAtom),
  (_get, set, value: string[]) => set(mapActiveOverlaysAtom, value),
)
export const mapActiveBaseLayerAtom = atomWithStorage(
  'mapActiveBaseLayer',
  'OsmColor',
  undefined,
  { getOnInit: true },
)
export const setMapActiveBaseLayerAtom = atom(
  (get) => get(mapActiveBaseLayerAtom),
  (_get, set, value: string) => set(mapActiveBaseLayerAtom, value),
)
export const mapPopIconAtom = atomWithStorage(
  'mapPopIcon',
  'statusGroupSymbols',
  undefined,
  { getOnInit: true },
)
export const setMapPopIconAtom = atom(
  (get) => get(mapPopIconAtom),
  (_get, set, value: string) => set(mapPopIconAtom, value),
)
export const mapTpopIconAtom = atomWithStorage(
  'mapTpopIcon',
  'statusGroupSymbols',
  undefined,
  { getOnInit: true },
)
export const setMapTpopIconAtom = atom(
  (get) => get(mapTpopIconAtom),
  (_get, set, value: string) => set(mapTpopIconAtom, value),
)
export const mapPopLabelAtom = atomWithStorage('mapPopLabel', 'nr', undefined, {
  getOnInit: true,
})
export const setMapPopLabelAtom = atom(
  (get) => get(mapPopLabelAtom),
  (_get, set, value: string) => set(mapPopLabelAtom, value),
)
export const mapTpopLabelAtom = atomWithStorage(
  'mapTpopLabel',
  'nr',
  undefined,
  { getOnInit: true },
)
export const setMapTpopLabelAtom = atom(
  (get) => get(mapTpopLabelAtom),
  (_get, set, value: string) => set(mapTpopLabelAtom, value),
)
export const mapBeobDetailsOpenAtom = atom(false)
export const setMapBeobDetailsOpenAtom = atom(
  (get) => get(mapBeobDetailsOpenAtom),
  (_get, set, value: boolean) => set(mapBeobDetailsOpenAtom, value),
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
  [] as string[],
  undefined,
  { getOnInit: true },
)
export const setMapActiveApfloraLayersAtom = atom(
  (get) => get(mapActiveApfloraLayersAtom),
  (_get, set, value: string[]) => set(mapActiveApfloraLayersAtom, value),
)
