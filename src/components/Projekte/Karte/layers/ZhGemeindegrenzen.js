import React from 'react'
import { WMSTileLayer, GeoJSON } from 'react-leaflet'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import get from 'lodash/get'

const GemeindegrenzenLayer = () => (
  <WMSTileLayer
    url="//wms.zh.ch/FnsLWZHWMS"
    layers="gemeindegrenzen"
    opacity={0.5}
    transparent={true}
    version="1.3.0"
    format="image/png"
    maxNativeZoom={18}
    minZoom={0}
    maxZoom={22}
  />
)

const GeoJSONLayer = () => {
  const { data, loading, error } = useQuery(gql`
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

  //if (!data) return null
  const nodes = get(data, 'allChGemeindes.nodes') || []
  const data2 = nodes.map((n) => {
    const geometry = JSON.parse(get(n, 'wkbGeometry.geojson'))
    delete geometry.crs
    return {
      type: 'Feature',
      properties: { name: n.name || '' },
      geometry,
    }
  })
  data && console.log('ZhGemeindegrenzen, data2:', data2)

  return (
    <GeoJSON
      data={data2}
      //opacity={0.5}
      //transparent={true}
      //maxNativeZoom={18}
      //minZoom={0}
      //maxZoom={22}
    />
  )
}

export default GeoJSONLayer
