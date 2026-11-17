// the map layer and symbology state is kept completely in the url (one
// search param per aspect) so a map with its layers is linkable.
// url params win over the stored values when the map opens; every later
// change is written back through the router (see MapLayersUrlSync)
import { mapApfloraLayerCatalog, mapOverlayCatalog } from '../store/map.ts'

export const mapLayersParamNames = {
  overlays: 'mapOverlays',
  apfloraLayers: 'mapApfloraLayers',
  baseLayer: 'mapBaseLayer',
  popIcon: 'mapPopIcon',
  tpopIcon: 'mapTpopIcon',
  popLabel: 'mapPopLabel',
  tpopLabel: 'mapTpopLabel',
  showApfLayersForMultipleAps: 'mapShowApfLayersForMultipleAps',
} as const

export interface MapLayersState {
  overlays: string[]
  apfloraLayers: string[]
  baseLayer: string
  popIcon: string
  tpopIcon: string
  popLabel: string
  tpopLabel: string
  showApfLayersForMultipleAps: boolean
}

// returns only the aspects present (and well-formed) in the params;
// unknown overlay/apflora layer values are dropped (renames, hand-edited
// urls) rather than crashing the map
export const readMapLayersFromSearchParams = (
  params: URLSearchParams,
): Partial<MapLayersState> => {
  const result: Partial<MapLayersState> = {}
  if (params.has(mapLayersParamNames.overlays)) {
    result.overlays = params
      .getAll(mapLayersParamNames.overlays)
      .filter((value) => mapOverlayCatalog.some((o) => o.value === value))
  }
  if (params.has(mapLayersParamNames.apfloraLayers)) {
    result.apfloraLayers = params
      .getAll(mapLayersParamNames.apfloraLayers)
      .filter((value) => mapApfloraLayerCatalog.some((l) => l.value === value))
  }
  for (const key of [
    'baseLayer',
    'popIcon',
    'tpopIcon',
    'popLabel',
    'tpopLabel',
  ] as const) {
    const value = params.get(mapLayersParamNames[key])
    if (value) result[key] = value
  }
  if (params.has(mapLayersParamNames.showApfLayersForMultipleAps)) {
    result.showApfLayersForMultipleAps =
      params.get(mapLayersParamNames.showApfLayersForMultipleAps) === 'true'
  }
  return result
}

// returns params with every layer param replaced from state, in a
// canonical order (non-layer params first, then the layer params):
// URLSearchParams preserves insertion order, so rebuilding in a fixed
// order makes an unchanged state produce an unchanged string.
// Empty lists are written as a single empty value (`mapOverlays=`) so
// the reader can tell "no overlays" from "param not managed".
// Returns the input instance unchanged when nothing differs, so callers
// can skip no-op navigations
export const writeMapLayersToSearchParams = (
  params: URLSearchParams,
  state: MapLayersState,
): URLSearchParams => {
  const layerParamValues = new Set<string>(Object.values(mapLayersParamNames))
  const next = new URLSearchParams()
  for (const [key, value] of params.entries()) {
    if (!layerParamValues.has(key)) next.append(key, value)
  }
  const appendList = (name: string, values: string[]) => {
    if (values.length === 0) {
      next.append(name, '')
      return
    }
    for (const value of values) next.append(name, value)
  }
  appendList(mapLayersParamNames.overlays, state.overlays)
  appendList(mapLayersParamNames.apfloraLayers, state.apfloraLayers)
  next.set(mapLayersParamNames.baseLayer, state.baseLayer)
  next.set(mapLayersParamNames.popIcon, state.popIcon)
  next.set(mapLayersParamNames.tpopIcon, state.tpopIcon)
  next.set(mapLayersParamNames.popLabel, state.popLabel)
  next.set(mapLayersParamNames.tpopLabel, state.tpopLabel)
  next.set(
    mapLayersParamNames.showApfLayersForMultipleAps,
    String(state.showApfLayersForMultipleAps),
  )
  return next.toString() === params.toString() ? params : next
}
