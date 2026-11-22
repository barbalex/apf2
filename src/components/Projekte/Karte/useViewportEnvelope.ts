import { useEffect, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { useDebouncedCallback } from 'use-debounce'

import { mapViewportBoundsAtom } from '../../../store/index.ts'
import type { MapViewportBounds } from '../../../store/index.ts'

/**
 * Viewport filtering for the apflora map layers — the port of ps's
 * viewportEnvelope.ts. Layers add
 * `{ geomPoint: { intersects: <polygon> } }` to their query_pop/tpop/beob
 * p_filter, so only features near the current view are fetched (beob has
 * 500k rows). The polygon is this module's padded envelope.
 */

/** How far the query envelope extends beyond the viewport, per axis. */
export const VIEWPORT_PAD_FACTOR = 0.5

/** Debounce for envelope updates after moveend — rapid zooming must not
 * refetch every layer per zoom step. */
export const VIEWPORT_ENVELOPE_DEBOUNCE_MS = 400

/** Pads bounds per axis, clamped to the world. */
export const padBounds = (
  bounds: MapViewportBounds,
  factor = VIEWPORT_PAD_FACTOR,
): MapViewportBounds => {
  const padLng = (bounds.neLng - bounds.swLng) * factor
  const padLat = (bounds.neLat - bounds.swLat) * factor
  return {
    swLng: Math.max(bounds.swLng - padLng, -180),
    swLat: Math.max(bounds.swLat - padLat, -90),
    neLng: Math.min(bounds.neLng + padLng, 180),
    neLat: Math.min(bounds.neLat + padLat, 90),
  }
}

/** Whether inner lies completely inside outer (inclusive edges). */
export const envelopeContains = (
  inner: MapViewportBounds,
  outer: MapViewportBounds,
): boolean =>
  inner.swLng >= outer.swLng &&
  inner.swLat >= outer.swLat &&
  inner.neLng <= outer.neLng &&
  inner.neLat <= outer.neLat

/**
 * The next query envelope for new map bounds, or null to keep the current
 * one: while the raw viewport still lies inside the last emitted padded
 * envelope, pans and zoom-ins keep their loaded features instead of
 * refetching.
 */
export const resolveViewportEnvelope = (
  raw: MapViewportBounds,
  emitted: MapViewportBounds | null,
): MapViewportBounds | null =>
  emitted && envelopeContains(raw, emitted) ? null : padBounds(raw)

/** The envelope as the GeoJSON polygon the intersects filter expects. */
export const viewportFilterPolygon = (
  envelope: MapViewportBounds,
): {
  type: 'Polygon'
  coordinates: [number, number][][]
} => ({
  type: 'Polygon',
  coordinates: [
    [
      [envelope.swLng, envelope.swLat],
      [envelope.neLng, envelope.swLat],
      [envelope.neLng, envelope.neLat],
      [envelope.swLng, envelope.neLat],
      [envelope.swLng, envelope.swLat],
    ],
  ],
})

export type ViewportFilterPolygon = ReturnType<typeof viewportFilterPolygon>

/**
 * The padded viewport polygon for a layer's geomPoint-intersects filter, or
 * null while the map has not reported bounds yet (layers gate their query
 * on this — null must never trigger the unfiltered fetch-all). The first
 * bounds emit immediately; later changes are debounced and skipped while
 * the viewport stays inside the emitted window. The emitted polygon is a
 * new object only when it actually changed, so queryKeys stay stable.
 */
export const useViewportFilterEnvelope = (): ViewportFilterPolygon | null => {
  const bounds = useAtomValue(mapViewportBoundsAtom)
  const [polygon, setPolygon] = useState<ViewportFilterPolygon | null>(null)
  const emittedRef = useRef<MapViewportBounds | null>(null)

  const emitDebounced = useDebouncedCallback((raw: MapViewportBounds) => {
    const next = resolveViewportEnvelope(raw, emittedRef.current)
    if (next) {
      emittedRef.current = next
      setPolygon(viewportFilterPolygon(next))
    }
  }, VIEWPORT_ENVELOPE_DEBOUNCE_MS)

  useEffect(() => {
    if (!bounds) return
    if (!emittedRef.current) {
      const first = padBounds(bounds)
      emittedRef.current = first
      setPolygon(viewportFilterPolygon(first))
      return
    }
    emitDebounced(bounds)
  }, [bounds, emitDebounced])

  return polygon
}
