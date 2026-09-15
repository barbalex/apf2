import { GeoJSON } from 'react-leaflet'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import type { Feature, FeatureCollection } from 'geojson'

interface GemeindeNode {
  id: string
  // exists on the GraphQL type but is not queried here;
  // the access keeps the popup property in place (undefined -> '')
  text?: string
  geom: {
    geojson: string
  } | null
}

interface GemeindenQueryResult {
  allChAdministrativeUnits: {
    nodes: GemeindeNode[]
  }
}

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

export const Gemeinden = () => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['gemeinden'],
    queryFn: async () => {
      const result = await apolloClient.query<GemeindenQueryResult>({
        query: graphql(`
          query karteGemeindesQuery {
            allChAdministrativeUnits(
              filter: { localisedcharacterstring: { equalTo: "Gemeinde" } }
            ) {
              nodes {
                id
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

  const nodes = data?.allChAdministrativeUnits?.nodes ?? []
  const gemeinden = nodes.map((n): Feature => ({
    type: 'Feature',
    properties: { Gemeinde: n.text ?? '' },
    geometry: JSON.parse(String(n?.geom?.geojson)),
  }))

  return (
    <GeoJSON
      // leaflet handles plain feature arrays like FeatureCollections,
      // but react-leaflet's data prop is typed as GeoJsonObject
      data={gemeinden as unknown as FeatureCollection}
      style={style}
      interactive={false}
    />
  )
}
