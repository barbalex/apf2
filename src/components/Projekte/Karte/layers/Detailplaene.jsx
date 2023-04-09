import React, { useContext, useCallback } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'
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

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Detailpläne: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  if (!data) return null

  const nodes = data?.allDetailplaenes?.nodes ?? []
  const detailplaene = nodes.map((n) => ({
    type: 'Feature',
    properties: n.data ? JSON.parse(n.data) : null,
    geometry: JSON.parse(n?.geom?.geojson),
  }))

  return <GeoJSON data={detailplaene} style={style} interactive={false} />
}

export default observer(DetailplaeneLayer)
