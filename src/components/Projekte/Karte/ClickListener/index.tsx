import { useRef } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import * as ReactDOMServer from 'react-dom/server'
import { useMapEvent, useMap } from 'react-leaflet/hooks'
import { Popup as LeafletPopup } from 'leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import { ellipse } from '@turf/ellipse'
import { useParams } from 'react-router'
import { apiFetch } from '../../../../modules/api.ts'

import { Popup } from '../layers/Popup.js'
import type { LayerData } from '../layers/Popup.js'
import { xmlToLayersData } from '../../../../modules/xmlToLayersData.js'
import { overlays } from '../overlays.ts'
import { fetchWmsData } from './fetchWmsData.ts'
import { layersDataFromRequestData } from './layersDataFromRequestData.ts'

import {
  addNotificationAtom,
  mapActiveOverlaysAtom,
} from '../../../../store/index.ts'

export const ClickListener = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { apId } = useParams()

  const activeOverlays = useAtomValue(mapActiveOverlaysAtom)

  const map = useMap()

  // When the user clicks the Leaflet popup close button the click event
  // propagates up to the map and would trigger a new query. Guard against
  // that by setting this flag in the popupclose handler and clearing it
  // after the click has been processed.
  const justClosedPopup = useRef(false)
  useMapEvent('popupclose', () => {
    justClosedPopup.current = true
    // Reset after a short delay so normal map clicks still work.
    setTimeout(() => {
      justClosedPopup.current = false
    }, 0)
  })

  const onClick = async (event: LeafletMouseEvent) => {
    if (justClosedPopup.current) return
    // while a filter polygon is drawn/edited/deleted or a measurement is
    // being taken, clicks belong to that tool, not to feature-info queries
    if (map.getContainer()?.classList.contains('geoman-active')) return
    if (map.getContainer()?.classList.contains('measure-active')) return
    const { lat, lng } = event.latlng
    const zoom = map.getZoom()
    const mapSize = map.getSize()
    const bounds = map.getBounds()
    // idea 1:
    // get all layers
    // run onEachFeature on all layers
    // not possible because onEachFeature is not called when layer is added

    // idea 2:
    // get all layers
    // fetch all layers features using turf.inside
    // https://gis.stackexchange.com/a/277207/13491
    // turf.intersect(myPt.toGeoJSON(), myPoly.toGeoJSON()); if (intersection != undefined){ // must be inside }
    // possible but not efficient

    // idea 3:
    // use a FeatureGroup https://leafletjs.com/reference.html#featuregroup
    // does not seem to work

    // idea 4:
    // get all activeOverlays
    // filter queryable ones (Markierungen, Gemeinden, Betreuungsgebiete, Detailplaene, Massnahmen)
    // directly query them using ST_Contains
    // using https://postgis.net/docs/ST_Contains.html, https://github.com/graphile-contrib/postgraphile-plugin-connection-filter-postgis#operators
    // build popup from responses (https://leafletjs.com/reference.html#popup)
    // remove onEachFeature from queryable layers
    // seems to be the best solution
    // may even be more efficient as no need to bind popups when adding layers

    const layersData: LayerData[] = []

    if (activeOverlays.includes('Gemeinden')) {
      let gemeinde: { id: number; text: string } | null = null
      try {
        gemeinde = await apiFetch<{ id: number; text: string } | null>(
          '/rpc/get_gemeinde_at_point',
          {
            method: 'POST',
            body: JSON.stringify({ p_lng: lng, p_lat: lat }),
          },
        )
      } catch (error) {
        console.log(error)
      }

      if (gemeinde) {
        layersData.push({
          label: 'Gemeinden',
          properties: [['Gemeinde', gemeinde.text]],
        })
      }
    }

    if (activeOverlays.includes('Betreuungsgebiete')) {
      let betreuung: {
        gebiet_nr: number | null
        gebiet_name: string | null
        firma: string | null
        projektleiter: string | null
        telefon: string | null
      } | null = null
      try {
        betreuung = await apiFetch<NonNullable<typeof betreuung>>(
          '/rpc/get_betreuungsgebiet_at_point',
          {
            method: 'POST',
            body: JSON.stringify({ p_lng: lng, p_lat: lat }),
          },
        )
      } catch (error) {
        console.log(error)
      }

      if (betreuung) {
        layersData.push({
          label: 'Betreuungsgebiete',
          properties: Object.entries(betreuung),
        })
      }
    }

    if (activeOverlays.includes('Detailplaene')) {
      let detailplan: { id: string; data: string | null } | null = null
      try {
        detailplan = await apiFetch<{ id: string; data: string | null } | null>(
          '/rpc/get_detailplan_at_point',
          {
            method: 'POST',
            body: JSON.stringify({ p_lng: lng, p_lat: lat }),
          },
        )
      } catch (error) {
        console.log(error)
      }

      if (detailplan?.data) {
        const properties = JSON.parse(detailplan.data)
        layersData.push({
          label: 'Detailpläne',
          properties: Object.entries(properties),
        })
      }
    }
    if (activeOverlays.includes('Markierungen')) {
      const radius =
        zoom > 19 ? 1
        : zoom === 19 ? 2
        : zoom === 18 ? 3
        : zoom === 17 ? 6
        : zoom === 16 ? 12
        : zoom === 15 ? 20
        : zoom === 14 ? 50
        : zoom > 12 ? 100
        : zoom > 10 ? 300
        : zoom > 8 ? 800
        : 1200
      try {
        const coordinates = [lng, lat]
        const options = { steps: 8, units: 'meters' as const }
        const circle = ellipse(coordinates, radius, radius, options)
        const nodes =
          (await apiFetch<
            {
              id: number
              gebiet: string | null
              pfostennum: string | null
              markierung: string | null
            }[]
          >('/rpc/get_markierungen_in_polygon', {
            method: 'POST',
            body: JSON.stringify({ p_polygon: circle.geometry }),
          })) ?? []
        for (const node of nodes) {
          const properties = {
            Gebiet: node?.gebiet ?? '',
            PfostenNr: node?.pfostennum ?? '',
            Markierung: node?.markierung ?? '',
          }
          layersData.push({
            label: 'Markierungen',
            properties: Object.entries(properties),
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (apId && activeOverlays.includes('MassnahmenFlaechen')) {
      let wmsData: string | undefined
      try {
        const bbox = `${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng}`
        const params = {
          service: 'WMS',
          version: '1.3.0',
          request: 'GetFeatureInfo',
          layers: 'flaechen', // linien, punkte
          crs: 'EPSG:4326',
          format: 'image/png',
          info_format: 'application/vnd.ogc.gml',
          feature_count: 40,
          query_layers: 'flaechen', // linien, punkte
          x: Math.round(event.containerPoint.x),
          y: Math.round(event.containerPoint.y),
          width: mapSize.x,
          height: mapSize.y,
          bbox,
        }
        const query = new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)]),
        )
        const res = await fetch(
          `https://wms.prod.qgiscloud.com/FNS/${apId}?${query}`,
        )
        // 406: user clicked where no massn exists
        if (res.status !== 406) {
          if (!res.ok) throw new Error(`GIS-Server: Status ${res.status}`)
          wmsData = await res.text()
        }
      } catch (error) {
        console.error('MassnahmenFlaechen:', error)
        addNotification({
          message: `Der GIS-Server, der die Massnahmen übermitteln soll, hat einen Fehler gemeldet. Informationen von Massnahmen werden daher nicht angezeigt, auch wenn eine Massnahme geklickt worden sein sollte`,
          options: {
            variant: 'info',
          },
        })
      }
      if (wmsData) {
        const parser = new window.DOMParser()
        const dataArray = xmlToLayersData(
          parser.parseFromString(wmsData, 'text/html'),
        )
        // do not open empty popups
        if (dataArray.length) {
          dataArray.forEach((data) => {
            layersData.push(data)
          })
        }
      }
    }
    if (apId && activeOverlays.includes('MassnahmenLinien')) {
      let wmsData: string | undefined
      try {
        const bbox = `${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng}`
        const params = {
          service: 'WMS',
          version: '1.3.0',
          request: 'GetFeatureInfo',
          layers: 'linien',
          crs: 'EPSG:4326',
          format: 'image/png',
          info_format: 'application/vnd.ogc.gml',
          feature_count: 40,
          query_layers: 'linien',
          x: Math.round(event.containerPoint.x),
          y: Math.round(event.containerPoint.y),
          width: mapSize.x,
          height: mapSize.y,
          bbox,
        }
        const query = new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)]),
        )
        const res = await fetch(
          `https://wms.prod.qgiscloud.com/FNS/${apId}?${query}`,
        )
        // 406: user clicked where no massn exists
        if (res.status !== 406) {
          if (!res.ok) throw new Error(`GIS-Server: Status ${res.status}`)
          wmsData = await res.text()
        }
      } catch (error) {
        console.error('MassnahmenLinien:', error)
        addNotification({
          message: `Der GIS-Server, der die Massnahmen übermitteln soll, hat einen Fehler gemeldet. Informationen von Massnahmen werden daher nicht angezeigt, auch wenn eine Massnahme geklickt worden sein sollte`,
          options: {
            variant: 'info',
          },
        })
      }
      if (wmsData) {
        const parser = new window.DOMParser()
        const dataArray = xmlToLayersData(
          parser.parseFromString(wmsData, 'text/html'),
        )
        // do not open empty popups
        if (dataArray.length) {
          dataArray.forEach((data) => {
            layersData.push(data)
          })
        }
      }
    }
    if (apId && activeOverlays.includes('MassnahmenPunkte')) {
      let wmsData: string | undefined
      try {
        const bbox = `${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng}`
        const params = {
          service: 'WMS',
          version: '1.3.0',
          request: 'GetFeatureInfo',
          layers: 'punkte',
          crs: 'EPSG:4326',
          format: 'image/png',
          info_format: 'application/vnd.ogc.gml',
          feature_count: 40,
          query_layers: 'punkte',
          x: Math.round(event.containerPoint.x),
          y: Math.round(event.containerPoint.y),
          width: mapSize.x,
          height: mapSize.y,
          bbox,
        }
        const query = new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)]),
        )
        const res = await fetch(
          `https://wms.prod.qgiscloud.com/FNS/${apId}?${query}`,
        )
        // 406: user clicked where no massn exists
        if (res.status !== 406) {
          if (!res.ok) throw new Error(`GIS-Server: Status ${res.status}`)
          wmsData = await res.text()
        }
      } catch (error) {
        console.error('MassnahmenPunkte:', error)
        addNotification({
          message: `Der GIS-Server, der die Massnahmen übermitteln soll, hat einen Fehler gemeldet. Informationen von Massnahmen werden daher nicht angezeigt, auch wenn eine Massnahme geklickt worden sein sollte`,
          options: {
            variant: 'info',
          },
        })
      }
      if (wmsData) {
        const parser = new window.DOMParser()
        const dataArray = xmlToLayersData(
          parser.parseFromString(wmsData, 'text/html'),
        )
        // do not open empty popups
        if (dataArray.length) {
          dataArray.forEach((data) => {
            layersData.push(data)
          })
        }
      }
    }

    // wms layers
    for (const overlay of overlays) {
      if (activeOverlays.includes(overlay.name as string) && overlay.wmsUrl) {
        const params = {
          request: 'GetFeatureInfo',
          service: 'WMS',
          version: overlay.wmsVersion ?? '1.3.0',
          crs: overlay.wmsCrs ?? 'EPSG:4326',
          layers: overlay.wmsLayers,
          query_layers: overlay.wmsQueryLayers,
          info_format: overlay.wmsInfoFormat ?? 'application/vnd.ogc.gml',
          x: Math.round(event.containerPoint.x),
          y: Math.round(event.containerPoint.y),
          width: mapSize.x,
          height: mapSize.y,
          bbox: `${bounds.getSouthWest().lat},${bounds.getSouthWest().lng},${bounds.getNorthEast().lat},${bounds.getNorthEast().lng}`,
        }
        const requestData = await fetchWmsData({
          url: overlay.wmsUrl,
          params,
          layerLabel: overlay.label,
        })
        // console.log('wms layers, requestData:', requestData)
        if (requestData) {
          layersDataFromRequestData({
            layersData,
            requestData,
            infoFormat: params.info_format,
          })
        }
      }
    }

    // "Gemeindegrenzen" is returned by several ZH WMS services as a base layer in
    // their GML responses regardless of the clicked feature. Only show it when the
    // "Gemeinden" overlay is explicitly active.
    const filteredLayersData =
      activeOverlays.includes('Gemeinden') ? layersData : (
        layersData.filter((d) => d.label !== 'Gemeindegrenzen')
      )

    if (!filteredLayersData.length) return

    const popupContent = ReactDOMServer.renderToString(
      <Popup
        layersData={filteredLayersData}
        mapSize={map.getSize()}
      />,
    )
    new LeafletPopup()
      .setLatLng(event.latlng)
      .setContent(popupContent)
      .openOn(map)
  }

  useMapEvent('click', (event) => void onClick(event))

  return null
}
