import React, { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import { observer } from 'mobx-react-lite'
import { useQuery, gql } from '@apollo/client'

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
    layer.bindPopup(
      popupFromProperties({
        properties: feature.properties,
        layerName: 'Detailpläne',
      }),
    )
  }
}

const DetailplaeneLayer = () => {
  const { enqueNotification } = useContext(storeContext)

  const { data, error } = useQuery(gql`
    query karteDetailplaenesQuery {
      allDetailplaenes {
        nodes {
          id
          data
          geom {
            geojson
          }
        }
      }
    }
  `)

  const nodes = data?.allDetailplaenes?.nodes ?? []
  const detailplaene = nodes.map((n) => ({
    type: 'Feature',
    properties: n.data ? JSON.parse(n.data) : null,
    geometry: JSON.parse(n?.geom?.geojson),
  }))

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Detailpläne: ${error.message}`,
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
