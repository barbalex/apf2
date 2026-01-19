import { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.ts'

interface GemeindeNode {
  id: string
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

export const Gemeinden = observer(() => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['gemeinden'],
    queryFn: async () => {
      const result = await apolloClient.query<GemeindenQueryResult>({
        query: gql`
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
        `,
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  if (!data) return null

  const nodes = data?.allChAdministrativeUnits?.nodes ?? []
  const gemeinden = nodes.map((n) => ({
    type: 'Feature',
    properties: { Gemeinde: n.text ?? '' },
    geometry: JSON.parse(n?.geom?.geojson),
  }))

  return (
    <GeoJSON
      data={gemeinden}
      style={style}
      interactive={false}
    />
  )
})
