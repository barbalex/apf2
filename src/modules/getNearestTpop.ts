/**
 * gets a latLng wgs 84
 * returns the nearest tpop of the ap
 * or null if none can be assigned
 */
import { nearestPoint } from '@turf/nearest-point'
import { featureCollection, point } from '@turf/helpers'
import { apiFetch } from './api.ts'

export const getNearestTpop = async ({
  latLng,
  apId,
  artId,
}: {
  latLng: { lat: number; lng: number }
  apId?: string
  artId?: string | null
}): Promise<{ id: string; popId: string } | null> => {
  const { lat, lng } = latLng
  // a beob may only be assigned to an ap listing its taxon under 'Taxa'
  // (apart). The ap's own art is inserted into apart by trigger
  // ap_update_add_apart, so checking apart covers all taxa of the ap
  if (apId && artId) {
    const aparts = await apiFetch<{ id: string }[]>(
      `/q_apart?ap_id=eq.${apId}&art_id=eq.${artId}&select=id`,
    )
    if (!aparts?.length) return null
  }
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
  // without this, turf's nearestPoint returns an empty feature's properties
  if (!tpops?.length) return null
  const tpopPoints = featureCollection(
    tpops.map((t) =>
      point([t.wgs84_lat, t.wgs84_long], {
        id: t.id,
        popId: t.pop_id,
      }),
    ),
  )
  const nearestTpopFeature = nearestPoint(myPoint, tpopPoints)
  return nearestTpopFeature.properties as { id: string; popId: string }
}
