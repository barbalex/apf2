import { useContext } from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { useMapEvent } from 'react-leaflet/hooks'
import { useApolloClient, gql } from '@apollo/client'
import L from 'leaflet'
import ellipse from '@turf/ellipse'

import storeContext from '../../../storeContext'
import Popup from './layers/Popup'

const ClickListener = () => {
  const store = useContext(storeContext)
  const { activeOverlays: activeOverlaysRaw } = store
  const activeOverlays = getSnapshot(activeOverlaysRaw)

  const client = useApolloClient()

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
    // filter queryable ones (Markierungen, Gemeinden, Betreuungsgebiete, Detailplaene, Massnahmen)
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
        gemeindenData = await client.query({
          query: gql`query karteGemeindesQuery {
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

      const node =
        gemeindenData?.data?.allChAdministrativeUnits?.nodes?.[0] ?? {}
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
    if (activeOverlays.includes('Betreuungsgebiete')) {
      let betreuungsgebieteData
      try {
        betreuungsgebieteData = await client.query({
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

      const node =
        betreuungsgebieteData?.data?.allNsBetreuungs?.nodes?.[0] ?? {}
      const properties = { ...node }
      delete properties.__typename
      delete properties.id
      layersData.push({
        label: 'Betreuungsgebiete',
        properties: Object.entries(properties),
      })
    }
    if (activeOverlays.includes('Detailplaene')) {
      let detailplaeneData
      try {
        detailplaeneData = await client.query({
          query: gql`query karteDetailplaenesQuery {
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

      const node = detailplaeneData?.data?.allDetailplaenes?.nodes?.[0] ?? {}
      const properties = node.data ? JSON.parse(node.data) : {}
      layersData.push({
        label: 'Detailpläne',
        properties: Object.entries(properties),
      })
    }
    if (activeOverlays.includes('Markierungen')) {
      let markierungenData
      const radius =
        zoom > 19
          ? 1
          : zoom === 19
          ? 2
          : zoom === 18
          ? 3
          : zoom === 17
          ? 6
          : zoom === 16
          ? 12
          : zoom === 15
          ? 20
          : zoom === 14
          ? 50
          : zoom > 12
          ? 100
          : zoom > 10
          ? 300
          : zoom > 8
          ? 800
          : 1200
      try {
        const coordinates = [lng, lat]
        const options = { steps: 8, units: 'meters' }
        const circle = ellipse(coordinates, radius, radius, options)
        markierungenData = await client.query({
          query: gql`
            query karteMarkierungesQuery($polygon: GeoJSON!) {
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

    if (!layersData.length) return

    const popupContent = ReactDOMServer.renderToString(
      <Popup layersData={layersData} mapSize={map.getSize()} />,
    )
    L.popup().setLatLng(event.latlng).setContent(popupContent).openOn(map)
  })

  console.log('ClickListener', {
    activeOverlays,
  })

  return null
}

export default observer(ClickListener)
