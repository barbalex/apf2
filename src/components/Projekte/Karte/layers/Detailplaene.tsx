import { GeoJSON } from 'react-leaflet'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import type { Feature, FeatureCollection } from 'geojson'

interface DetailplanNode {
  id: string
  data: string | null
  geom: {
    geojson: string
  } | null
}

interface DetailplaeneQueryResult {
  allDetailplaenes: {
    nodes: DetailplanNode[]
  }
}

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

export const Detailplaene = () => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['detailplaene'],
    queryFn: async () => {
      const result = await apolloClient.query<DetailplaeneQueryResult>({
        query: graphql(`
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
        `),
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  if (!data) return null

  const nodes = data?.allDetailplaenes?.nodes ?? []
  const detailplaene = nodes.map((n): Feature => ({
    type: 'Feature',
    properties: n.data ? JSON.parse(n.data) : null,
    geometry: JSON.parse(String(n?.geom?.geojson)),
  }))

  return (
    <GeoJSON
      // leaflet handles plain feature arrays like FeatureCollections,
      // but react-leaflet's data prop is typed as GeoJsonObject
      data={detailplaene as unknown as FeatureCollection}
      style={style}
      interactive={false}
    />
  )
}
