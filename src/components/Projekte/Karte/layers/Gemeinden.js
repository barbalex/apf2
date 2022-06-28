import React, { useContext, useCallback } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'
import { useQuery, gql } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import popupFromProperties from './popupFromProperties'
import storeContext from '../../../../storeContext'

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
  const map = useMap()
  const { enqueNotification } = useContext(storeContext)

  const { data, error } = useQuery(gql`
    query karteGemeindesQuery {
      allChAdministrativeUnits(
        filter: { localisedcharacterstring: { equalTo: "Gemeinde" } }
        orderBy: TEXT_ASC
      ) {
        nodes {
          id
          text
          geom {
            geojson
          }
        }
      }
    }
  `)

  const nodes = data?.allChAdministrativeUnits?.nodes ?? []
  const gemeinden = nodes.map((n) => ({
    type: 'Feature',
    properties: { Gemeinde: n.text ?? '' },
    geometry: JSON.parse(n?.geom?.geojson),
  }))

  const onEachFeature = useCallback(
    (feature, layer) => {
      if (feature.properties) {
        layer.bindPopup(
          popupFromProperties({
            properties: feature.properties,
            layerName: 'Gemeinden',
            mapSize: map.getSize(),
          }),
        )
      }
    },
    [map],
  )

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
