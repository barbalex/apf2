import { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { MobxContext } from '../../../../mobxContext.ts'

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

export const Detailplaene = observer(() => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['detailplaene'],
    queryFn: async () => {
      const result = await apolloClient.query<DetailplaeneQueryResult>({
        query: gql`
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
        `,
        fetchPolicy: 'no-cache',
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  if (!data) return null

  const nodes = data?.allDetailplaenes?.nodes ?? []
  const detailplaene = nodes.map((n) => ({
    type: 'Feature',
    properties: n.data ? JSON.parse(n.data) : null,
    geometry: JSON.parse(n?.geom?.geojson),
  }))

  return (
    <GeoJSON
      data={detailplaene}
      style={style}
      interactive={false}
    />
  )
})
