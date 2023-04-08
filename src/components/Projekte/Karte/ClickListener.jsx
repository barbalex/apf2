import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { useMapEvent } from 'react-leaflet/hooks'
import { useApolloClient, gql } from '@apollo/client'
import leaflet from 'leaflet'

import storeContext from '../../../storeContext'
import popupFromProperties from './layers/popupFromProperties'

const ClickListener = () => {
  const store = useContext(storeContext)
  const { activeOverlays: activeOverlaysRaw } = store
  const activeOverlays = getSnapshot(activeOverlaysRaw)

  const client = useApolloClient()

  const map = useMapEvent('click', async (event) => {
    const { lat, lng } = event.latlng
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

    console.log('ClickListener', {
      event,
      lat,
      lng,
    })

    let gemeindenData
    if (activeOverlays.includes('Gemeinden')) {
      // TODO:
      try {
        gemeindenData = await client.query({
          query: gql`query karteGemeindesQuery {
          allChAdministrativeUnits(
            filter: { 
              localisedcharacterstring: { equalTo: "Gemeinde" }, 
              geom: {contains: {type: "Point", coordinates: [${lng}, ${lat}]}}
            }
            orderBy: TEXT_ASC
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
    }
    console.log('ClickListener', {
      gemeindenData,
    })
    // map.eachLayer((layer) => {
    //   const pane = layer.options?.pane
    //   console.log('ClickListener', { layer, pane })
    // })
  })

  const panes = map.getPanes()
  const gemeindePane = panes?.Gemeinden

  console.log('ClickListener', {
    map,
    activeOverlays,
    layers: map._layers,
    panes,
    gemeindePane,
  })

  return null
}

export default observer(ClickListener)
