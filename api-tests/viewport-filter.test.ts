import { beforeAll, describe, expect, it } from 'vitest'

import { assertBackendAvailable, mintToken, pgrst } from './helpers.ts'

// the map layers' viewport filtering rides the p_filter protocol:
// {"geomPoint": {"intersects": <GeoJSON polygon>}} compiles to
// st_intersects(geom_point, st_geomfromgeojson(...)). These tests pin the
// new intersects operator of apflora.compile_filter against the local
// backend, the way the layers will use it via /rpc/query_pop.

// a small window around Zurich centre and a much larger one around the
// canton — both must return fewer pops than the unfiltered query
const polygon = (w: number, s: number, e: number, n: number) => ({
  type: 'Polygon' as const,
  coordinates: [
    [
      [w, s],
      [e, s],
      [e, n],
      [w, n],
      [w, s],
    ],
  ],
})

const queryPops = async (filter: unknown) => {
  const token = mintToken('apflora_reader')
  const res = await pgrst('/rpc/query_pop?select=id,wgs84_lat,wgs84_long', {
    method: 'POST',
    token,
    body: { p_filter: filter },
  })
  expect(res.status).toBe(200)
  return res.data as { id: string; wgs84_lat: number; wgs84_long: number }[]
}

describe('compile_filter: geomPoint intersects (map viewport filtering)', () => {
  beforeAll(async () => {
    await assertBackendAvailable()
  })

  it('returns only pops whose geom_point intersects the polygon', async () => {
    // Zurich centre, ~6x8 km
    const rows = await queryPops({
      geomPoint: { intersects: polygon(8.5, 47.35, 8.58, 47.4) },
    })
    expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) {
      expect(row.wgs84_long).toBeGreaterThanOrEqual(8.5)
      expect(row.wgs84_long).toBeLessThanOrEqual(8.58)
      expect(row.wgs84_lat).toBeGreaterThanOrEqual(47.35)
      expect(row.wgs84_lat).toBeLessThanOrEqual(47.4)
    }
  })

  it('a larger polygon returns a superset', async () => {
    const small = await queryPops({
      geomPoint: { intersects: polygon(8.5, 47.35, 8.58, 47.4) },
    })
    const large = await queryPops({
      geomPoint: { intersects: polygon(8.1, 47.1, 8.8, 47.6) },
    })
    const none = await queryPops({
      // somewhere in the Atlantic
      geomPoint: { intersects: polygon(-30, 20, -29, 21) },
    })
    const smallIds = new Set(small.map((r) => r.id))
    const largeIds = new Set(large.map((r) => r.id))
    expect(large.length).toBeGreaterThan(small.length)
    for (const id of smallIds) expect(largeIds.has(id)).toBe(true)
    expect(none).toEqual([])
  })

  it('combines with other filter keys (they are ANDed)', async () => {
    const all = await queryPops({
      geomPoint: { intersects: polygon(8.1, 47.1, 8.8, 47.6) },
    })
    const withNr = await queryPops({
      geomPoint: { intersects: polygon(8.1, 47.1, 8.8, 47.6) },
      nr: { isNull: false },
    })
    expect(withNr.length).toBeLessThanOrEqual(all.length)
    for (const row of withNr) expect(row.id).toBeTruthy()
  })
})
