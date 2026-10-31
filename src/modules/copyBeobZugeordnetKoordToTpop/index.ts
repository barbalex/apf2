import { apiFetch, apiUpdateByVariables } from '../api.ts'

import {
  store,
  addNotificationAtom,
  type Notification,
} from '../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const copyBeobZugeordnetKoordToTpop = async ({ id }: { id: string }) => {
  // fetch beob coodinates
  let beob:
    | {
        tpop_id: string | null
        wgs84_lat: number | null
        wgs84_long: number | null
      }
    | undefined
  try {
    const beobs = await apiFetch<
      {
        tpop_id: string | null
        wgs84_lat: number | null
        wgs84_long: number | null
      }[]
    >(`/q_beob?id=eq.${id}&select=tpop_id,wgs84_lat,wgs84_long`)
    beob = beobs?.[0]
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const {
    wgs84_lat: wgs84Lat,
    wgs84_long: wgs84Long,
    tpop_id: tpopId,
  } = beob ?? {}
  if (!tpopId) {
    return addNotification({
      message: 'Die Beobachtung ist keiner Teil-Population zugeordnet',
      options: {
        variant: 'error',
      },
    })
  }
  const geomPoint = {
    type: 'Point',
    coordinates: [wgs84Long, wgs84Lat],
    // need to add crs otherwise PostGIS v2.5 (on server) errors
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::4326',
      },
    },
  }

  // set tpop coordinates
  try {
    await apiUpdateByVariables('tpop', {
      id: tpopId,
      geomPoint,
    })
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  return
}
