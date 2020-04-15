import React, { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import 'leaflet'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import get from 'lodash/get'

import popupFromProperties from './popupFromProperties'
import fetchMarkierungen from '../../../../modules/fetchMarkierungen'
import storeContext from '../../../../storeContext'

const style = () => ({
  fill: true,
  fillOpacity: 0,
  color: 'orange',
  weight: 1,
  opacity: 1,
})
const onEachFeature = (feature, layer) => {
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}
const pTLOptions = {
  radius: 3,
  fillColor: '#ff7800',
  color: '#000',
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
}
const pointToLayer = (feature, latlng) => {
  if (typeof window === 'undefined') return {}
  return window.L.circleMarker(latlng, pTLOptions)
}

const MarkierungenLayer = () => {
  const store = useContext(storeContext)
  const { enqueNotification } = store

  const { data, error } = useQuery(gql`
    query karteMatkierungesQuery {
      allMarkierungens {
        nodes {
          id: ogcFid
          gebiet
          pfostennum
          markierung
          wkbGeometry {
            geojson
            srid
            x
            y
          }
        }
      }
    }
  `)

  const nodes = get(data, 'allMarkierungens.nodes') || []
  const markierungen = nodes.map((n) => ({
    type: 'Feature',
    properties: {
      Gebiet: n.gebiet || '',
      PfostenNr: n.pfostennum || '',
      Markierung: n.markierung || '',
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
    <GeoJSON
      data={markierungen}
      style={style}
      onEachFeature={onEachFeature}
      pointToLayer={pointToLayer}
    />
  )
}

export default observer(MarkierungenLayer)
