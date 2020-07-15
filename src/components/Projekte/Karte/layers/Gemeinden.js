import React, { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'

import popupFromProperties from './popupFromProperties'
import storeContext from '../../../../storeContext'

const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}

// see: https://leafletjs.com/reference-1.6.0.html#path-option
// need to fill or else popup will only happen when line is clicked
// when fill is true, need to give stroke an opacity
const style = () => ({
  fill: true,
  fillOpacity: 0,
  color: 'orange',
  weight: 3,
  opacity: 1,
})

const GemeindeLayer = () => {
  const { enqueNotification } = useContext(storeContext)

  const { data, error } = useQuery(gql`
    query karteGemeindesQuery {
      allChGemeindes {
        nodes {
          id: ogcFid
          name
          wkbGeometry {
            geojson
          }
        }
      }
    }
  `)

  const nodes = get(data, 'allChGemeindes.nodes') || []
  const gemeinden = nodes.map((n) => ({
    type: 'Feature',
    properties: { Gemeinde: n.name || '' },
    geometry: JSON.parse(get(n, 'wkbGeometry.geojson')),
  }))

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Gemeinden für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  if (!data) return null

  return (
    <GeoJSON data={gemeinden} style={style} onEachFeature={onEachFeature} />
  )
}

export default observer(GemeindeLayer)
