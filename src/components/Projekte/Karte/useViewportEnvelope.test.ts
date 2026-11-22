import { describe, expect, it } from 'vitest'

import {
  padBounds,
  envelopeContains,
  resolveViewportEnvelope,
  viewportFilterPolygon,
} from './useViewportEnvelope.ts'
import type { MapViewportBounds } from '../../../store/index.ts'

const bounds = (
  swLng: number,
  swLat: number,
  neLng: number,
  neLat: number,
): MapViewportBounds => ({ swLng, swLat, neLng, neLat })

describe('padBounds', () => {
  it('pads each axis by 50% of its extent', () => {
    // whole numbers keep the arithmetic exact: 1° per axis -> 2° total
    expect(padBounds(bounds(8, 47, 9, 48))).toEqual(bounds(7.5, 46.5, 9.5, 48.5))
  })

  it('supports a custom factor', () => {
    expect(padBounds(bounds(8, 47, 9, 48), 0.1)).toEqual(
      bounds(7.9, 46.9, 9.1, 48.1),
    )
  })

  it('clamps to the world', () => {
    expect(padBounds(bounds(-179.9, -89.9, 179.9, 89.9))).toEqual(
      bounds(-180, -90, 180, 90),
    )
  })
})

describe('envelopeContains', () => {
  const outer = bounds(8, 47, 9, 48)

  it('accepts equal and inner bounds (inclusive edges)', () => {
    expect(envelopeContains(outer, outer)).toBe(true)
    expect(envelopeContains(bounds(8.1, 47.1, 8.9, 47.9), outer)).toBe(true)
    expect(envelopeContains(bounds(8, 47, 8.5, 47.5), outer)).toBe(true)
  })

  it('rejects bounds sticking out on any side', () => {
    expect(envelopeContains(bounds(7.9, 47.1, 8.9, 47.9), outer)).toBe(false)
    expect(envelopeContains(bounds(8.1, 46.9, 8.9, 47.9), outer)).toBe(false)
    expect(envelopeContains(bounds(8.1, 47.1, 9.1, 47.9), outer)).toBe(false)
    expect(envelopeContains(bounds(8.1, 47.1, 8.9, 48.1), outer)).toBe(false)
  })
})

describe('resolveViewportEnvelope', () => {
  const zurich = bounds(8.5, 47.3, 8.6, 47.4)

  it('emits the padded envelope when none was emitted yet', () => {
    expect(resolveViewportEnvelope(zurich, null)).toEqual(padBounds(zurich))
  })

  it('keeps the emitted envelope while the viewport stays inside it', () => {
    const emitted = padBounds(zurich)
    // with 50% padding the window is twice the viewport: pans of up to half
    // a viewport stay inside, as does zooming in
    expect(
      resolveViewportEnvelope(bounds(8.54, 47.34, 8.64, 47.44), emitted),
    ).toBeNull()
    expect(
      resolveViewportEnvelope(bounds(8.53, 47.33, 8.57, 47.37), emitted),
    ).toBeNull()
  })

  it('emits a new envelope once the viewport leaves the window', () => {
    const emitted = padBounds(zurich)
    const panned = bounds(8.7, 47.3, 8.8, 47.4)
    expect(resolveViewportEnvelope(panned, emitted)).toEqual(padBounds(panned))
    // zooming out grows beyond the window too
    const zoomedOut = bounds(8.2, 47.1, 8.9, 47.6)
    expect(resolveViewportEnvelope(zoomedOut, emitted)).toEqual(
      padBounds(zoomedOut),
    )
  })
})

describe('viewportFilterPolygon', () => {
  it('builds a closed ring in lng/lat order', () => {
    const polygon = viewportFilterPolygon(bounds(8, 47, 9, 48))
    expect(polygon.type).toBe('Polygon')
    expect(polygon.coordinates).toEqual([
      [
        [8, 47],
        [9, 47],
        [9, 48],
        [8, 48],
        [8, 47],
      ],
    ])
  })
})
