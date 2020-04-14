import React from 'react'
import { GeoJSON } from 'react-leaflet'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import get from 'lodash/get'

import popupFromProperties from './popupFromProperties'
const onEachFeature = (feature, layer) => {
  console.log('onEachFeature', { feature, layer })
  if (feature.properties) {
    layer.bindPopup(popupFromProperties(feature.properties))
  }
}

const style = () => ({ fill: false, color: 'orange', weight: 1 })

const GeoJSONLayer = () => {
  const { data, error } = useQuery(gql`
    query test {
      allChGemeindes {
        nodes {
          name
          wkbGeometry {
            geojson
          }
        }
      }
    }
  `)

  const nodes = get(data, 'allChGemeindes.nodes') || []
  const gemeinden = nodes.map((n) => {
    const geometry = JSON.parse(get(n, 'wkbGeometry.geojson'))
    return {
      type: 'Feature',
      properties: { name: n.name || '' },
      geometry,
    }
  })

  console.log('Gemeinden, gemeinden:', gemeinden)

  if (error) console.log(error)

  if (!data) return null

  return (
    <GeoJSON data={gemeinden} style={style} onEachFeature={onEachFeature} />
  )
}

export default GeoJSONLayer
