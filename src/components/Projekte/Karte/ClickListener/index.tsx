import { useRef } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import * as ReactDOMServer from 'react-dom/server'
import { useMapEvent, useMap } from 'react-leaflet/hooks'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import L from 'leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import { ellipse } from '@turf/ellipse'
import { useParams } from 'react-router'
import axios from 'redaxios'
import type { Response } from 'redaxios'

import { Popup } from '../layers/Popup.js'
import type { LayerData } from '../layers/Popup.js'
import { xmlToLayersData } from '../../../../modules/xmlToLayersData.js'
import { overlays } from '../overlays.ts'
import { fetchWmsData } from './fetchWmsData.ts'
import type { RedaxiosError } from './fetchWmsData.ts'
import { layersDataFromRequestData } from './layersDataFromRequestData.ts'

import {
  addNotificationAtom,
  mapActiveOverlaysAtom,
} from '../../../../store/index.ts'

interface KarteAdministrativeUnitsQueryResult {
  allChAdministrativeUnits?: {
    nodes?: { id: number; text: string | null }[] | null
  } | null
}

interface KarteBetreuungsgebietesQueryResult {
  allNsBetreuungs?: {
    nodes?: {
      id: number
      gebietNr: number
      gebietName: string | null
      firma: string | null
      projektleiter: string | null
      telefon: string | null
    }[] | null
  } | null
}

interface KarteDetailplaenesQueryResult {
  allDetailplaenes?: {
    nodes?: { id: string; data: string | null }[] | null
  } | null
}

export const ClickListener = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { apId } = useParams()

  const activeOverlays = useAtomValue(mapActiveOverlaysAtom)

  const apolloClient = useApolloClient()

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
      let gemeindenData:
        | { data?: KarteAdministrativeUnitsQueryResult | undefined }
        | undefined
      try {
        gemeindenData = await apolloClient.query<KarteAdministrativeUnitsQueryResult>({
          query: dynamicGql`query karteAdministrativeUnitsQuery {
          allChAdministrativeUnits(
            filter: { 
              localisedcharacterstring: { equalTo: "Gemeinde" }, 
              geom: {contains: {type: "Point", coordinates: [${lng}, ${lat}]}}
            }
          ) {
            nodes {
              id
              text
            }
          }
        }`,
        })
      } catch (error) {
        console.log(error)
      }

      const node = gemeindenData?.data?.allChAdministrativeUnits?.nodes?.[0]
      if (node) {
        const properties: Record<string, unknown> = { ...node }
        delete properties.__typename
        delete properties.id
        properties.Gemeinde = properties.text
        delete properties.text
        layersData.push({
          label: 'Gemeinden',
          properties: Object.entries(properties),
        })
      }
    }

    if (activeOverlays.includes('Betreuungsgebiete')) {
      let betreuungsgebieteData:
        | { data?: KarteBetreuungsgebietesQueryResult | undefined }
        | undefined
      try {
        betreuungsgebieteData = await apolloClient.query<KarteBetreuungsgebietesQueryResult>({
          query: dynamicGql`query karteBetreuungsgebietesQuery {
              allNsBetreuungs(
                filter: { 
                  geom: {contains: {type: "Point", coordinates: [${lng}, ${lat}]}}
                }
              ) {
                nodes {
                  id: gebietNr
                  gebietNr
                  gebietName
                  firma
                  projektleiter
                  telefon
                }
              }
            }`,
        })
      } catch (error) {
        console.log(error)
      }

      const node = betreuungsgebieteData?.data?.allNsBetreuungs?.nodes?.[0]
      if (node) {
        const properties: Record<string, unknown> = { ...node }
        delete properties.__typename
        delete properties.id
        layersData.push({
          label: 'Betreuungsgebiete',
          properties: Object.entries(properties),
        })
      }
    }

    if (activeOverlays.includes('Detailplaene')) {
      let detailplaeneData:
        | { data?: KarteDetailplaenesQueryResult | undefined }
        | undefined
      try {
        detailplaeneData = await apolloClient.query<KarteDetailplaenesQueryResult>({
          query: dynamicGql`query karteDetailplaenesFilteredQuery {
          allDetailplaenes(
            filter: { 
              geom: {intersects: {type: "Point", coordinates: [${lng}, ${lat}]}}
            }
          ) {
            nodes {
              id
              data
            }
          }
        }`,
        })
      } catch (error) {
        console.log(error)
      }

      const node = detailplaeneData?.data?.allDetailplaenes?.nodes?.[0]
      if (node?.data) {
        const properties = JSON.parse(node.data)
        layersData.push({
          label: 'Detailpläne',
          properties: Object.entries(properties),
        })
      }
    }
    if (activeOverlays.includes('Markierungen')) {
      let markierungenData
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
        markierungenData = await apolloClient.query({
          query: graphql(`
            query KarteClickListenerQuery($polygon: GeoJSON!) {
              allMarkierungens(
                filter: { wkbGeometry: { coveredBy: $polygon } }
              ) {
                nodes {
                  id: ogcFid
                  gebiet
                  pfostennum
                  markierung
                }
              }
            }
          `),
          variables: { polygon: circle.geometry },
        })
      } catch (error) {
        console.log(error)
      }

      const nodes = markierungenData?.data?.allMarkierungens?.nodes
      if (nodes?.length) {
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
      }
    }
    if (apId && activeOverlays.includes('MassnahmenFlaechen')) {
      let res: Response<string> | undefined
      let failedToFetch = false
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
        res = await axios<string>({
          method: 'get',
          url: `https://wms.prod.qgiscloud.com/FNS/${apId}`,
          params,
        })
      } catch (error) {
        // redaxios rejections are response-like objects
        // augmented with optional request and response fields
        const axiosError = error as RedaxiosError
        console.log({ error: axiosError, errorToJSON: axiosError?.toJSON?.(), res })
        if (axiosError.status == 406) {
          // user clicked where no massn exists
        } else if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('error.response.data', axiosError.response.data)
          console.error('error.response.status', axiosError.response.status)
          console.error('error.response.headers', axiosError.response.headers)
          failedToFetch = true
        } else if (axiosError.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error('error.request:', axiosError.request)
          failedToFetch = true
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('error.message', axiosError.message)
          failedToFetch = true
        }
        if (axiosError.message?.toLowerCase()?.includes('failed to fetch')) {
          failedToFetch = true
        }
        if (failedToFetch)
          addNotification({
            message: `Der GIS-Server, der die Massnahmen übermitteln soll, hat einen Fehler gemeldet. Informationen von Massnahmen werden daher nicht angezeigt, auch wenn eine Massnahme geklickt worden sein sollte`,
            options: {
              variant: 'info',
            },
          })
      }
      if (!failedToFetch && res?.data) {
        const parser = new window.DOMParser()
        const dataArray = xmlToLayersData(
          parser.parseFromString(res.data, 'text/html'),
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
      let res: Response<string> | undefined
      let failedToFetch = false
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
        res = await axios<string>({
          method: 'get',
          url: `https://wms.prod.qgiscloud.com/FNS/${apId}`,
          params,
        })
      } catch (error) {
        // redaxios rejections are response-like objects
        // augmented with optional request and response fields
        const axiosError = error as RedaxiosError
        console.log({ error: axiosError, errorToJSON: axiosError?.toJSON?.(), res })
        if (axiosError.status == 406) {
          // user clicked where no massn exists
        } else if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('error.response.data', axiosError.response.data)
          console.error('error.response.status', axiosError.response.status)
          console.error('error.response.headers', axiosError.response.headers)
          failedToFetch = true
        } else if (axiosError.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error('error.request:', axiosError.request)
          failedToFetch = true
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('error.message', axiosError.message)
          failedToFetch = true
        }
        if (axiosError.message?.toLowerCase()?.includes('failed to fetch')) {
          failedToFetch = true
        }
        if (failedToFetch)
          addNotification({
            message: `Der GIS-Server, der die Massnahmen übermitteln soll, hat einen Fehler gemeldet. Informationen von Massnahmen werden daher nicht angezeigt, auch wenn eine Massnahme geklickt worden sein sollte`,
            options: {
              variant: 'info',
            },
          })
      }
      if (!failedToFetch && res?.data) {
        const parser = new window.DOMParser()
        const dataArray = xmlToLayersData(
          parser.parseFromString(res.data, 'text/html'),
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
      let res: Response<string> | undefined
      let failedToFetch = false
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
        res = await axios<string>({
          method: 'get',
          url: `https://wms.prod.qgiscloud.com/FNS/${apId}`,
          params,
        })
      } catch (error) {
        // redaxios rejections are response-like objects
        // augmented with optional request and response fields
        const axiosError = error as RedaxiosError
        console.log({ error: axiosError, errorToJSON: axiosError?.toJSON?.(), res })
        if (axiosError.status == 406) {
          // user clicked where no massn exists
        } else if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('error.response.data', axiosError.response.data)
          console.error('error.response.status', axiosError.response.status)
          console.error('error.response.headers', axiosError.response.headers)
          failedToFetch = true
        } else if (axiosError.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error('error.request:', axiosError.request)
          failedToFetch = true
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('error.message', axiosError.message)
          failedToFetch = true
        }
        if (axiosError.message?.toLowerCase()?.includes('failed to fetch')) {
          failedToFetch = true
        }
        if (failedToFetch)
          addNotification({
            message: `Der GIS-Server, der die Massnahmen übermitteln soll, hat einen Fehler gemeldet. Informationen von Massnahmen werden daher nicht angezeigt, auch wenn eine Massnahme geklickt worden sein sollte`,
            options: {
              variant: 'info',
            },
          })
      }
      if (!failedToFetch && res?.data) {
        const parser = new window.DOMParser()
        const dataArray = xmlToLayersData(
          parser.parseFromString(res.data, 'text/html'),
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
    L.popup().setLatLng(event.latlng).setContent(popupContent).openOn(map)
  }

  useMapEvent('click', (event) => void onClick(event))

  return null
}
