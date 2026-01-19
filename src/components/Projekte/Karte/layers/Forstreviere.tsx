// https://stackoverflow.com/a/25296972/712005
// also: https://gis.stackexchange.com/a/130553/13491
import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { GeoJSON } from 'react-leaflet'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { MobxContext } from '../../../../mobxContext.ts'

interface ForstrevierNode {
  id: number
  forevnr: string | null
  revName: string | null
  geom: {
    geojson: string
  } | null
}

interface FostrreviereQueryResult {
  allForstreviers: {
    nodes: ForstrevierNode[]
  }
}

// see: https://leafletjs.com/reference-1.6.0.html#path-option
// need to fill or else popup will only happen when line is clicked
// when fill is true, need to give stroke an opacity
const style = () => ({
  fill: true,
  fillOpacity: 0,
  color: 'green',
  weight: 3,
  opacity: 1,
})

export const Forstreviere = observer(() => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['forstreviere'],
    queryFn: async () => {
      const result = await apolloClient.query<FostrreviereQueryResult>({
        query: gql`
          query forstrevierQuery {
            allForstreviers {
              nodes {
                id: ogcFid
                forevnr
                revName
                geom: wkbGeometry {
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

  const nodes = data?.allForstreviers?.nodes ?? []
  const forstReviereData = nodes.map((n) => ({
    type: 'Feature',
    properties: {},
    geometry: JSON.parse(n?.geom?.geojson),
  }))

  return (
    <GeoJSON
      data={forstReviereData}
      style={style}
      interactive={false}
    />
  )
})
