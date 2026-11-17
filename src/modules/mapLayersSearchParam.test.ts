import { describe, expect, it } from 'vitest'

import {
  mapLayersParamNames,
  readMapLayersFromSearchParams,
  writeMapLayersToSearchParams,
} from './mapLayersSearchParam.ts'

const state = {
  overlays: ['Gemeinden', 'ZhUepOverlay'],
  apfloraLayers: ['pop', 'tpop'],
  baseLayer: 'OsmBw',
  popIcon: 'statusGroupSymbols',
  tpopIcon: 'normal',
  popLabel: 'nr',
  tpopLabel: 'name',
  showApfLayersForMultipleAps: true,
}

describe('mapLayersSearchParam', () => {
  it('writes and reads back a full state (round trip)', () => {
    const written = writeMapLayersToSearchParams(new URLSearchParams(), state)
    expect(readMapLayersFromSearchParams(written)).toEqual(state)
  })

  it('writes repeated params for the list aspects', () => {
    const written = writeMapLayersToSearchParams(new URLSearchParams(), state)
    expect(written.getAll(mapLayersParamNames.overlays)).toEqual(state.overlays)
    expect(written.getAll(mapLayersParamNames.apfloraLayers)).toEqual(
      state.apfloraLayers,
    )
  })

  it('reads empty lists from absent params as empty arrays', () => {
    const written = writeMapLayersToSearchParams(new URLSearchParams(), {
      ...state,
      overlays: [],
      apfloraLayers: [],
    })
    expect(readMapLayersFromSearchParams(written).overlays).toEqual([])
    expect(readMapLayersFromSearchParams(written).apfloraLayers).toEqual([])
  })

  it('replaces stale values instead of accumulating them', () => {
    const stale = new URLSearchParams(
      'mapOverlays=ZhSvo&mapApfloraLayers=beobZugeordnet',
    )
    const written = writeMapLayersToSearchParams(stale, {
      ...state,
      overlays: ['Gemeinden'],
      apfloraLayers: ['pop'],
    })
    expect(written.getAll(mapLayersParamNames.overlays)).toEqual(['Gemeinden'])
    expect(written.getAll(mapLayersParamNames.apfloraLayers)).toEqual(['pop'])
  })

  it('returns the input instance when nothing changes', () => {
    const written = writeMapLayersToSearchParams(new URLSearchParams(), state)
    const again = writeMapLayersToSearchParams(written, state)
    expect(again).toBe(written)
  })

  it('returns an empty object when no layer params are present', () => {
    expect(
      readMapLayersFromSearchParams(new URLSearchParams('map=12/47.3/8.5')),
    ).toEqual({})
  })

  it('drops unknown overlay and apflora layer values', () => {
    const params = new URLSearchParams(
      'mapOverlays=DoesNotExist&mapOverlays=Gemeinden&mapApfloraLayers=nope',
    )
    expect(readMapLayersFromSearchParams(params).overlays).toEqual([
      'Gemeinden',
    ])
    expect(readMapLayersFromSearchParams(params).apfloraLayers).toEqual([])
  })

  it('ignores empty string values for the scalar aspects', () => {
    const params = new URLSearchParams('mapBaseLayer=&mapPopIcon=statusGroup')
    expect(readMapLayersFromSearchParams(params).baseLayer).toBeUndefined()
    expect(readMapLayersFromSearchParams(params).popIcon).toBe('statusGroup')
  })

  it('parses the apf-layers-for-multiple-aps toggle', () => {
    expect(
      readMapLayersFromSearchParams(
        new URLSearchParams('mapShowApfLayersForMultipleAps=true'),
      ).showApfLayersForMultipleAps,
    ).toBe(true)
    expect(
      readMapLayersFromSearchParams(
        new URLSearchParams('mapShowApfLayersForMultipleAps=false'),
      ).showApfLayersForMultipleAps,
    ).toBe(false)
  })
})
