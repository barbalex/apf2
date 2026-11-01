/**
 * gets a latLng wgs 84
 * returns tpopId of nearest tpop
 */
import { nearestPoint } from '@turf/nearest-point'
import { featureCollection, point } from '@turf/helpers'
import { apiFetch } from './api.ts'

export const getNearestTpop = async ({
  latLng,
  apId,
}: {
  latLng: { lat: number; lng: number }
  apId?: string
}) => {
  const { lat, lng } = latLng
  const myPoint = point([lat, lng])
  // phase 5: the old apById > popsByApId > tpopsByPopId chain is one
  // query_tpop call with nested forward-relation filters
  const tpops = await apiFetch<
    {
      id: string
      pop_id: string | null
      wgs84_lat: number
      wgs84_long: number
    }[]
  >('/rpc/query_tpop?select=id,pop_id,wgs84_lat,wgs84_long', {
    method: 'POST',
    body: JSON.stringify({
      p_filter: {
        wgs84Lat: { isNull: false },
        popByPopId: {
          apByApId: {
            id: { equalTo: apId || '99999999-9999-9999-9999-999999999999' },
          },
        },
      },
    }),
  })
  const tpopPoints = featureCollection(
    (tpops ?? []).map((t) =>
      point([t.wgs84_lat, t.wgs84_long], {
        id: t.id,
        popId: t.pop_id,
      }),
    ),
  )
  const nearestTpopFeature = nearestPoint(myPoint, tpopPoints)
  return nearestTpopFeature.properties
}
