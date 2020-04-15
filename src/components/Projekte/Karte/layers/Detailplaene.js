import React, { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import get from 'lodash/get'

import popupFromProperties from './popupFromProperties'
import storeContext from '../../../../storeContext'

// see: https://leafletjs.com/reference-1.6.0.html#path-option
// need to fill or else popup will only happen when line is clicked
// when fill is true, need to give stroke an opacity
const style = () => ({
  fill: true,
  fillOpacity: 0,
  color: 'red',
  weight: 1,
  opacity: 1,
})

const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}

const DetailplaeneLayer = () => {
  const { enqueNotification } = useContext(storeContext)

  const { data, error } = useQuery(gql`
    query karteMatkierungesQuery {
      allDetailplaenes {
        nodes {
          id: ogcFid
          gebiet
          fleachennu
          substrat
          pflegeSzp
          shapeArea
          wkbGeometry {
            geojson
          }
        }
      }
    }
  `)

  const nodes = get(data, 'allDetailplaenes.nodes') || []
  const detailplaene = nodes.map((n) => ({
    type: 'Feature',
    properties: {
      Gebiet: n.gebiet || '',
      FlächenNr: n.fleachennu || '',
      Substrat: n.substrat || '',
      PflegeSzp: n.pflege_szp || '',
      Fläche: n.shape_area || '',
    },
    geometry: JSON.parse(get(n, 'wkbGeometry.geojson')),
  }))

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Markierungen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  if (!data) return null

  return (
    <GeoJSON data={detailplaene} style={style} onEachFeature={onEachFeature} />
  )
}

export default observer(DetailplaeneLayer)
