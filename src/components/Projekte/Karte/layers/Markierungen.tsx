import { GeoJSON } from 'react-leaflet'
import 'leaflet'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import type { Feature, FeatureCollection } from 'geojson'
import type { LatLng } from 'leaflet'

interface MarkierungNode {
  id: number
  gebiet: string | null
  pfostennum: string | null
  markierung: string | null
  wkbGeometry: {
    geojson: string
  } | null
}

interface MarkierungenQueryResult {
  allMarkierungens: {
    nodes: MarkierungNode[]
  }
}

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
const pointToLayer = (_feature: Feature, latlng: LatLng) =>
  window.L.circleMarker(latlng, pTLOptions)

export const Markierungen = () => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['markierungen'],
    queryFn: async () => {
      const result = await apolloClient.query<MarkierungenQueryResult>({
        query: graphql(`
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
        `),
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  if (!data) return null

  const nodes = data?.allMarkierungens?.nodes ?? []
  const markierungen = nodes.map((n): Feature => ({
    type: 'Feature',
    properties: {
      Gebiet: n.gebiet ?? '',
      PfostenNr: n.pfostennum ?? '',
      Markierung: n.markierung ?? '',
    },
    geometry: JSON.parse(String(n?.wkbGeometry?.geojson)),
  }))

  return (
    <GeoJSON
      // leaflet handles plain feature arrays like FeatureCollections,
      // but react-leaflet's data prop is typed as GeoJsonObject
      data={markierungen as unknown as FeatureCollection}
      style={style}
      pointToLayer={pointToLayer}
      interactive={false}
    />
  )
}
