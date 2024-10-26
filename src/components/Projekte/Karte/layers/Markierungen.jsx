import React, { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import 'leaflet'
import { observer } from 'mobx-react-lite'
import { useQuery, gql } from '@apollo/client'

import { StoreContext } from '../../../../storeContext.js'

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
  const store = useContext(StoreContext)
  const { enqueNotification } = store

  const { data, error } = useQuery(gql`
    query KarteMarkierungensQuery {
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

  if (error) {
    enqueNotification({
      message: `Fehler beim Laden der Markierungen für die Karte: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }

  if (!data) return null

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

  return (
    <GeoJSON
      data={markierungen}
      style={style}
      pointToLayer={pointToLayer}
      interactive={false}
    />
  )
}

export default observer(MarkierungenLayer)
