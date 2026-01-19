import { useContext } from 'react'
import { GeoJSON } from 'react-leaflet'
import 'leaflet'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { MobxContext } from '../../../../mobxContext.ts'

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
const pointToLayer = (feature, latlng) =>
  window.L.circleMarker(latlng, pTLOptions)

export const Markierungen = observer(() => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['markierungen'],
    queryFn: async () => {
      const result = await apolloClient.query<MarkierungenQueryResult>({
        query: gql`
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
        `,
        fetchPolicy: 'no-cache',
      })
      if (result.error) throw result.error
      return result.data
    },
  })

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
})
