/**
 * gets a latLng wgs 84
 * returns tpopId of nearest tpop
 */
import nearestPoint from '@turf/nearest-point'
import { featureCollection, point } from '@turf/helpers'
import gql from 'graphql-tag'
import get from 'lodash/get'
import flatten from 'lodash/flatten'
import isFinite from 'lodash/isFinite'

import epsg2056to4326 from './epsg2056to4326'

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
              tpopsByPopId(
                filter: { x: { isNull: false }, y: { isNull: false } }
              ) {
                nodes {
                  id
                  popId
                  x
                  y
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
    pops.map(p =>
      get(p, 'tpopsByPopId.nodes', []).filter(
        t => isFinite(t.x) && isFinite(t.y),
      ),
    ),
  )
  const tpopPoints = featureCollection(
    tpops.map(t =>
      point(epsg2056to4326(+t.x, +t.y), {
        id: t.id,
        popId: t.popId,
      }),
    ),
  )
  const nearestTpopFeature = nearestPoint(myPoint, tpopPoints)
  return nearestTpopFeature.properties
}
