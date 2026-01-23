/**
 * gets a latLng wgs 84
 * returns tpopId of nearest tpop
 */
import { nearestPoint } from '@turf/nearest-point'
import { featureCollection, point } from '@turf/helpers'
import { gql } from '@apollo/client'
import {
  store as jotaiStore,
  apolloClientAtom,
} from '../store/index.ts'

export const getNearestTpop = async ({ latLng, apId }) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  const { lat, lng } = latLng
  const myPoint = point([lat, lng])
  const { data } = await apolloClient.query({
    query: gql`
      query getNearestTpopQuery($apId: UUID!) {
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
    variables: { apId: apId || '99999999-9999-9999-9999-999999999999' },
  })
  const pops = data?.apById?.popsByApId?.nodes ?? []
  const tpops = pops
    .map((p) => (p?.tpopsByPopId?.nodes ?? []).filter((t) => t.wgs84Lat))
    .flat()
  const tpopPoints = featureCollection(
    tpops.map((t) =>
      point([t.wgs84Lat, t.wgs84Long], {
        id: t.id,
        popId: t.popId,
      }),
    ),
  )
  const nearestTpopFeature = nearestPoint(myPoint, tpopPoints)
  return nearestTpopFeature.properties
}
