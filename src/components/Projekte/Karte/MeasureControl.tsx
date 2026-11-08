import { useEffect, useRef, useState } from 'react'
import { useMap } from 'react-leaflet'
import { CircleMarker, LayerGroup, Polyline } from 'leaflet'
import { MdStraighten } from 'react-icons/md'
import { length as turfLength } from '@turf/length'
import { area as turfArea } from '@turf/area'
import { lineString, polygon as turfPolygon } from '@turf/helpers'
import type { LatLng, LeafletMouseEvent } from 'leaflet'
import type { Feature, LineString, Polygon as PolygonGeometry } from 'geojson'

import styles from './FullscreenControl.module.css'

// first-party replacement for leaflet-measure (unmaintained since 2018,
// Leaflet-1-only). Measures distances and — with three or more points —
// the enclosed area, like the old control did
const ACTIVE_COLOR = '#f45942'
const COMPLETED_COLOR = '#b22c25'

// toggled on the map container while measuring so ClickListener can
// ignore map clicks (see geoman-active for the same pattern)
const MEASURE_ACTIVE_CLASS = 'measure-active'

const formatLength = (meters: number) => {
  if (meters < 1000) return `${meters.toLocaleString('de-CH')} m`
  const km = meters / 1000
  return `${km.toLocaleString('de-CH', { maximumFractionDigits: 2 })} km`
}

const formatArea = (squareMeters: number) => {
  const base = `${Math.round(squareMeters).toLocaleString('de-CH')} m²`
  if (squareMeters < 10_000) return base
  const ha = squareMeters / 10_000
  return `${base} (${ha.toLocaleString('de-CH', { maximumFractionDigits: 2 })} ha)`
}

const pathLength = (latlngs: LatLng[]) =>
  latlngs.length < 2 ?
    0
  : turfLength(
      lineString(latlngs.map((l) => [l.lng, l.lat])) as Feature<LineString>,
      { units: 'meters' },
    )

const pathArea = (latlngs: LatLng[]) => {
  if (latlngs.length < 3) return 0
  const ring = [
    ...latlngs.map((l) => [l.lng, l.lat]),
    [latlngs[0]!.lng, latlngs[0]!.lat],
  ]
  return turfArea(turfPolygon([ring]) as Feature<PolygonGeometry>)
}

export const MeasureControl = () => {
  const map = useMap()
  const [measuring, setMeasuring] = useState(false)
  // LatLngs of the fixed vertices while measuring
  const latlngsRef = useRef<LatLng[]>([])
  // all measure layers: the path being measured plus the last completed one
  const layerGroupRef = useRef<LayerGroup | null>(null)
  const pathRef = useRef<Polyline | null>(null)
  const rubberRef = useRef<Polyline | null>(null)
  const cursorRef = useRef<CircleMarker | null>(null)

  const removeInProgressLayers = () => {
    latlngsRef.current = []
    pathRef.current?.remove()
    rubberRef.current?.remove()
    cursorRef.current?.remove()
    pathRef.current = null
    rubberRef.current = null
    cursorRef.current = null
  }

  useEffect(() => {
    if (!measuring) return

    const layerGroup = new LayerGroup()
    layerGroup.addTo(map)
    layerGroupRef.current = layerGroup

    pathRef.current = new Polyline([], {
      color: ACTIVE_COLOR,
      weight: 2,
    }).addTo(layerGroup)
    rubberRef.current = new Polyline([], {
      color: ACTIVE_COLOR,
      weight: 1,
      dashArray: '4,4',
    }).addTo(layerGroup)
    // invisible marker following the cursor; carries the live tooltip
    cursorRef.current = new CircleMarker(map.getCenter(), {
      radius: 0,
      interactive: false,
    })
      .bindTooltip('', { permanent: true, direction: 'top', opacity: 1 })
      .addTo(layerGroup)

    const redraw = (cursor?: LatLng) => {
      const latlngs = latlngsRef.current
      pathRef.current?.setLatLngs(latlngs)
      const base = pathLength(latlngs)
      const live =
        cursor ? base + pathLength([...latlngs.slice(-1), cursor]) : base
      const hint = latlngs.length ?
        'Doppelklick beendet die Messung'
      : 'Klicken, um die Messung zu beginnen'
      cursorRef.current?.setLatLng(
        cursor ?? latlngs[latlngs.length - 1] ?? map.getCenter(),
      )
      cursorRef.current
        ?.getTooltip()
        ?.setContent(
          latlngs.length ? `${formatLength(live)}<br />${hint}` : hint,
        )
    }

    const onClick = (e: LeafletMouseEvent) => {
      latlngsRef.current.push(e.latlng)
      redraw()
    }
    const onPointerMove = (e: LeafletMouseEvent) => {
      const latlngs = latlngsRef.current
      if (!latlngs.length) return
      rubberRef.current?.setLatLngs([latlngs[latlngs.length - 1]!, e.latlng])
      redraw(e.latlng)
    }
    const finish = () => {
      const latlngs = latlngsRef.current
      // the double click fires two clicks first, which added the same
      // vertex twice
      while (
        latlngs.length > 1 &&
        latlngs[latlngs.length - 1]!.equals(latlngs[latlngs.length - 2]!)
      ) {
        latlngs.pop()
      }
      if (latlngs.length < 2) return

      // replace the in-progress layers with a completed measurement
      // (the previous completed one goes with them)
      removeInProgressLayers()
      const completed = new Polyline(latlngs, {
        color: COMPLETED_COLOR,
        weight: 2,
      }).addTo(layerGroupRef.current!)
      const area = pathArea(latlngs)
      const content =
        area ?
          `${formatLength(pathLength(latlngs))}<br />${formatArea(area)}`
        : formatLength(pathLength(latlngs))
      completed.bindTooltip(content, {
        permanent: true,
        direction: 'top',
        opacity: 1,
      })
      new CircleMarker(latlngs[0]!, {
        radius: 3,
        color: COMPLETED_COLOR,
        interactive: false,
      }).addTo(layerGroupRef.current!)
      completed.openTooltip()
      redraw()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        removeInProgressLayers()
        redraw()
      }
      if (e.key === 'Enter') finish()
    }

    map.getContainer()?.classList.add(MEASURE_ACTIVE_CLASS)
    map.on('click', onClick)
    map.on('dblclick', finish)
    map.on('pointermove', onPointerMove)
    window.addEventListener('keydown', onKeyDown)
    redraw()

    return () => {
      map.getContainer()?.classList.remove(MEASURE_ACTIVE_CLASS)
      map.off('click', onClick)
      map.off('dblclick', finish)
      map.off('pointermove', onPointerMove)
      window.removeEventListener('keydown', onKeyDown)
      // the in-progress path is discarded, the last completed
      // measurement stays until a new one starts
      removeInProgressLayers()
    }
  }, [map, measuring])

  useEffect(
    () => () => {
      // remove everything when the Karte unmounts
      layerGroupRef.current?.remove()
      layerGroupRef.current = null
    },
    [],
  )

  const toggleMeasuring = () => {
    if (!measuring) {
      // a new measurement discards the previous result
      layerGroupRef.current?.remove()
      layerGroupRef.current = null
    }
    setMeasuring(!measuring)
  }

  return (
    <button
      onClick={toggleMeasuring}
      title={measuring ? 'Messung beenden' : 'Distanz und Fläche messen'}
      className={styles.button}
      style={measuring ? { color: ACTIVE_COLOR } : undefined}
    >
      <MdStraighten />
    </button>
  )
}
