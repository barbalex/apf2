import React, { useContext, useCallback } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'
import 'leaflet'
import { observer } from 'mobx-react-lite'
import { useQuery, gql } from '@apollo/client'

import popupFromProperties from './popupFromProperties'
import storeContext from '../../../../storeContext'

const style = () => ({
  fill: true,
  fillOpacity: 0,
  color: 'orange',
  weight: 1,
  opacity: 1,
})
const pTLOptions = {
  radius: 3,
  fillColor: '#ff7800',
  color: '#000',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
}
const pointToLayer = (feature, latlng) =>
  window.L.circleMarker(latlng, pTLOptions)

const MarkierungenLayer = () => {
  const map = useMap()
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const { data, error } = useQuery(gql`
    query karteMarkierungesQuery {
      allMarkierungens {
        nodes {
          id: ogcFid
          gebiet
          pfostennum
          markierung
          wkbGeometry {
            geojson
          }
        }
      }
    }
  `)

  const nodes = data?.allMarkierungens?.nodes ?? []
  const markierungen = nodes.map((n) => ({
    type: 'Feature',
    properties: {
      Gebiet: n.gebiet ?? '',
      PfostenNr: n.pfostennum ?? '',
      Markierung: n.markierung ?? '',
    },
    geometry: JSON.parse(n?.wkbGeometry?.geojson),
  }))

  const onEachFeature = useCallback(
    (feature, layer) => {
      if (feature.properties) {
        // console.log('Markierungen, onEachFeature, mapSize:', mapSize)
        layer.bindPopup(
          popupFromProperties({
            properties: feature.properties,
            layerName: 'Markierungen',
            mapSize: map.getSize(),
          }),
        )
      }
    },
    [map],
  )

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
    <GeoJSON
      data={markierungen}
      style={style}
      onEachFeature={onEachFeature}
      pointToLayer={pointToLayer}
    />
  )
}

export default observer(MarkierungenLayer)
