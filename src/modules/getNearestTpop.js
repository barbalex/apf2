/**
 * gets a latLng wgs 84
 * returns tpopId of nearest tpop
 */
import nearestPoint from '@turf/nearest-point'
import { featureCollection, point } from '@turf/helpers'
import gql from 'graphql-tag'
import get from 'lodash/get'
import flatten from 'lodash/flatten'

export default async ({ activeNodes, latLng, client }) => {
  const { lat, lng } = latLng
  const myPoint = point([lat, lng])
  const { data } = await client.query({
    query: gql`
      query Query($apId: UUID!) {
        apById(id: $apId) {
          id
          popsByApId {
            nodes {
              id
              tpopsByPopId(filter: { wgs84Lat: { isNull: false } }) {
                nodes {
                  id
                  popId
                  wgs84Lat
                  wgs84Long
                }
              }
            }
          }
        }
      }
    `,
    variables: { apId: activeNodes.ap },
  })
  const pops = get(data, 'apById.popsByApId.nodes', [])
  const tpops = flatten(
    pops.map(p => get(p, 'tpopsByPopId.nodes', []).filter(t => t.wgs84Lat)),
  )
  const tpopPoints = featureCollection(
    tpops.map(t =>
      point([t.wgs84Lat, t.wgs84Long], {
        id: t.id,
        popId: t.popId,
      }),
    ),
  )
  const nearestTpopFeature = nearestPoint(myPoint, tpopPoints)
  return nearestTpopFeature.properties
}
