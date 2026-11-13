import { describe, it, expect } from 'vitest'

import { epsg2056to4326 } from './epsg2056to4326.ts'
import { epsg4326to2056 } from './epsg4326to2056.ts'

// reference points in LV95 (Swiss coordinates): Bern (origin), Zürich
// (Bellevue-ish) and the Tessin — spread over the country so a broken
// projection definition can't accidentally pass
const lv95Points: [number, number][] = [
  [2600000, 1200000],
  [2685150, 1249040],
  [2720000, 1110000],
]

describe('epsg2056to4326', () => {
  it('returns WGS84 as [lat, lng]', () => {
    const [lat, lng] = epsg2056to4326(2685150, 1249040)

    // Zürich lies around 47.37°N, 8.54°E
    expect(lat).toBeGreaterThan(47.3)
    expect(lat).toBeLessThan(47.4)
    expect(lng).toBeGreaterThan(8.5)
    expect(lng).toBeLessThan(8.6)
  })

  it('accepts string inputs (coordinates from inputs are strings)', () => {
    expect(epsg2056to4326('2685150', '1249040')).toEqual(
      epsg2056to4326(2685150, 1249040),
    )
  })
})

describe('epsg2056to4326 and epsg4326to2056 roundtrip', () => {
  it('roundtrips every reference point within a meter', () => {
    for (const [x, y] of lv95Points) {
      const [lat = Number.NaN, lng = Number.NaN] = epsg2056to4326(x, y)

      // epsg4326to2056 takes (lng, lat) and rounds to whole meters
      const [x2 = Number.NaN, y2 = Number.NaN] = epsg4326to2056(lng, lat)

      expect(Math.abs(x2 - x)).toBeLessThanOrEqual(1)
      expect(Math.abs(y2 - y)).toBeLessThanOrEqual(1)
    }
  })
})
