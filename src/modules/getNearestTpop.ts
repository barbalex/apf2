/**
 * gets a latLng wgs 84
 * returns tpopId of nearest tpop
 */
import { nearestPoint } from '@turf/nearest-point'
import { featureCollection, point } from '@turf/helpers'
import { graphql } from '../gql/index.ts'
import {
  getApolloClientFromStore,
} from '../store/index.ts'

export const getNearestTpop = async ({
  latLng,
  apId,
}: {
  latLng: { lat: number; lng: number }
  apId?: string
}) => {
  const apolloClient = getApolloClientFromStore()
  const { lat, lng } = latLng
  const myPoint = point([lat, lng])
  const { data } = await apolloClient.query({
    query: graphql(`
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
    `),
    variables: { apId: apId || '99999999-9999-9999-9999-999999999999' },
  })
  const pops = data?.apById?.popsByApId?.nodes ?? []
  const tpops = pops
    .map((p) => (p?.tpopsByPopId?.nodes ?? []).filter((t) => !!t?.wgs84Lat))
    .flat()
  const tpopPoints = featureCollection(
    tpops.map((t) =>
      point([t?.wgs84Lat ?? 0, t?.wgs84Long ?? 0], {
        id: t?.id ?? '',
        popId: t?.popId ?? null,
      }),
    ),
  )
  const nearestTpopFeature = nearestPoint(myPoint, tpopPoints)
  return nearestTpopFeature.properties
}
