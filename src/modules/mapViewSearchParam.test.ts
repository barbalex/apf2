import { describe, expect, it } from 'vitest'

import { formatMapView, parseMapView } from './mapViewSearchParam.ts'

describe('mapViewSearchParam', () => {
  it('formats a view as zoom/lat/lng', () => {
    expect(
      formatMapView({
        center: { lat: 47.37688888, lng: 8.54169444 },
        zoom: 12,
      }),
    ).toBe('12/47.37689/8.54169')
  })

  it('keeps fractional zoom, trimmed to two decimals', () => {
    expect(
      formatMapView({ center: { lat: 47.3, lng: 8.5 }, zoom: 12.126666 }),
    ).toBe('12.13/47.30000/8.50000')
  })

  it('parses a formatted view back (round trip)', () => {
    const view = { center: { lat: 47.37689, lng: 8.54169 }, zoom: 12 }
    expect(parseMapView(formatMapView(view))).toEqual(view)
  })

  it('parses a hand-written param', () => {
    expect(parseMapView('0/0/0')).toEqual({
      center: { lat: 0, lng: 0 },
      zoom: 0,
    })
  })

  it('returns undefined for absent values', () => {
    expect(parseMapView(undefined)).toBeUndefined()
    expect(parseMapView(null)).toBeUndefined()
    expect(parseMapView('')).toBeUndefined()
  })

  it('returns undefined for malformed values', () => {
    expect(parseMapView('12')).toBeUndefined()
    expect(parseMapView('12/47.3')).toBeUndefined()
    expect(parseMapView('12/47.3/8.5/3')).toBeUndefined()
    expect(parseMapView('twelve/47.3/8.5')).toBeUndefined()
    expect(parseMapView('12/../8.5')).toBeUndefined()
  })

  it('returns undefined for out-of-range values', () => {
    expect(parseMapView('24/47.3/8.5')).toBeUndefined()
    expect(parseMapView('-1/47.3/8.5')).toBeUndefined()
    expect(parseMapView('12/91/8.5')).toBeUndefined()
    expect(parseMapView('12/47.3/181')).toBeUndefined()
  })
})
