import { useSetAtom, useAtomValue } from 'jotai'
import * as ReactDOMServer from 'react-dom/server'
import { useMapEvent } from 'react-leaflet/hooks'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import L from 'leaflet'
import { ellipse } from '@turf/ellipse'
import { useParams } from 'react-router'
import axios from 'redaxios'

import { Popup } from './layers/Popup.tsx'
import { xmlToLayersData } from '../../../modules/xmlToLayersData.ts'

import {
  addNotificationAtom,
  mapActiveOverlaysAtom,
} from '../../../store/index.ts'

export const ClickListener = () => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { apId } = useParams()

  const activeOverlays = useAtomValue(mapActiveOverlaysAtom)

  const apolloClient = useApolloClient()

  const map = useMapEvent('click', async (event) => {
    const { lat, lng } = event.latlng
    const zoom = map.getZoom()
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
    // filter queryable ones (Markierungen, Gemeinden, Betreuungsgebiete, Forstreviere, Detailplaene, Massnahmen)
    // directly query them using ST_Contains
    // using https://postgis.net/docs/ST_Contains.html, https://github.com/graphile-contrib/postgraphile-plugin-connection-filter-postgis#operators
    // build popup from responses (https://leafletjs.com/reference.html#popup)
    // remove onEachFeature from queryable layers
    // seems to be the best solution
    // may even be more efficient as no need to bind popups when adding layers

    const layersData = []

    if (activeOverlays.includes('Gemeinden')) {
      let gemeindenData
      try {
        gemeindenData = await apolloClient.query({
          query: gql`query karteAdministrativeUnitsQuery {
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
        const properties = { ...node }
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
      let betreuungsgebieteData
      try {
        betreuungsgebieteData = await apolloClient.query({
          query: gql`query karteBetreuungsgebietesQuery {
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
        const properties = { ...node }
        delete properties.__typename
        delete properties.id
        layersData.push({
          label: 'Betreuungsgebiete',
          properties: Object.entries(properties),
        })
      }
    }

    // Forstreviere
    if (activeOverlays.includes('Forstreviere')) {
      let forstreviereData
      try {
        forstreviereData = await apolloClient.query({
          query: gql`query karteForstrevieresQuery {
              allForstreviers(
                filter: { 
                  wkbGeometry: {contains: {type: "Point", coordinates: [${lng}, ${lat}]}}
                }
              ) {
                nodes {
                  Nr: forevnr
                  Name: revName
                }
              }
            }`,
        })
      } catch (error) {
        console.log(error)
      }

      const node = forstreviereData?.data?.allForstreviers?.nodes?.[0]
      if (node) {
        const properties = { ...node }
        delete properties.__typename
        delete properties.id
        layersData.push({
          label: 'Forstreviere',
          properties: Object.entries(properties),
        })
      }
    }

    if (activeOverlays.includes('Detailplaene')) {
      let detailplaeneData
      try {
        detailplaeneData = await apolloClient.query({
          query: gql`query karteDetailplaenesFilteredQuery {
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
        const options = { steps: 8, units: 'meters' }
        const circle = ellipse(coordinates, radius, radius, options)
        markierungenData = await apolloClient.query({
          query: gql`
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
          `,
          variables: { polygon: circle.geometry },
        })
      } catch (error) {
        console.log(error)
      }

      const nodes = markierungenData?.data?.allMarkierungens?.nodes
      if (nodes?.length) {
        for (const node of nodes) {
          const properties = {
            Gebiet: node.gebiet ?? '',
            PfostenNr: node.pfostennum ?? '',
            Markierung: node.markierung ?? '',
          }
          layersData.push({
            label: 'Markierungen',
            properties: Object.entries(properties),
          })
        }
      }
    }
    if (apId && activeOverlays.includes('MassnahmenFlaechen')) {
      const mapSize = map.getSize()
      const bounds = map.getBounds()
      let res
      let failedToFetch = false
      try {
        const bbox = `${bounds._southWest.lat},${bounds._southWest.lng},${bounds._northEast.lat},${bounds._northEast.lng}`
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
        res = await axios({
          method: 'get',
          url: `https://wms.prod.qgiscloud.com/FNS/${apId}`,
          params,
        })
      } catch (error) {
        console.log({ error, errorToJSON: error?.toJSON?.(), res })
        if (error.status == 406) {
          // user clicked where no massn exists
        } else if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('error.response.data', error.response.data)
          console.error('error.response.status', error.response.status)
          console.error('error.response.headers', error.response.headers)
          failedToFetch = true
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error('error.request:', error.request)
          failedToFetch = true
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('error.message', error.message)
          failedToFetch = true
        }
        if (error.message?.toLowerCase()?.includes('failed to fetch')) {
          failedToFetch = true
        }
        failedToFetch &&
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
      const mapSize = map.getSize()
      const bounds = map.getBounds()
      let res
      let failedToFetch = false
      try {
        const bbox = `${bounds._southWest.lat},${bounds._southWest.lng},${bounds._northEast.lat},${bounds._northEast.lng}`
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
        res = await axios({
          method: 'get',
          url: `https://wms.prod.qgiscloud.com/FNS/${apId}`,
          params,
        })
      } catch (error) {
        console.log({ error, errorToJSON: error?.toJSON?.(), res })
        if (error.status == 406) {
          // user clicked where no massn exists
        } else if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('error.response.data', error.response.data)
          console.error('error.response.status', error.response.status)
          console.error('error.response.headers', error.response.headers)
          failedToFetch = true
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error('error.request:', error.request)
          failedToFetch = true
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('error.message', error.message)
          failedToFetch = true
        }
        if (error.message?.toLowerCase()?.includes('failed to fetch')) {
          failedToFetch = true
        }
        failedToFetch &&
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
      const mapSize = map.getSize()
      const bounds = map.getBounds()
      let res
      let failedToFetch = false
      try {
        const bbox = `${bounds._southWest.lat},${bounds._southWest.lng},${bounds._northEast.lat},${bounds._northEast.lng}`
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
        res = await axios({
          method: 'get',
          url: `https://wms.prod.qgiscloud.com/FNS/${apId}`,
          params,
        })
      } catch (error) {
        console.log({ error, errorToJSON: error?.toJSON?.(), res })
        if (error.status == 406) {
          // user clicked where no massn exists
        } else if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('error.response.data', error.response.data)
          console.error('error.response.status', error.response.status)
          console.error('error.response.headers', error.response.headers)
          failedToFetch = true
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error('error.request:', error.request)
          failedToFetch = true
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('error.message', error.message)
          failedToFetch = true
        }
        if (error.message?.toLowerCase()?.includes('failed to fetch')) {
          failedToFetch = true
        }
        failedToFetch &&
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

    if (!layersData.length) return

    const popupContent = ReactDOMServer.renderToString(
      <Popup
        layersData={layersData}
        mapSize={map.getSize()}
      />,
    )
    L.popup().setLatLng(event.latlng).setContent(popupContent).openOn(map)
  })

  return null
}
