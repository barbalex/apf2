import { queryBeob } from './queryBeob.ts'
import { updateTpopById } from './updateTpopById.ts'

import {
  store,
  addNotificationAtom,
  apolloClientAtom,
  type Notification,
} from '../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const copyBeobZugeordnetKoordToTpop = async ({ id }: { id: string }) => {
  const apolloClient = store.get(apolloClientAtom)!
  // fetch beob coodinates
  let beobResult
  try {
    beobResult = await apolloClient.query({
      query: queryBeob,
      variables: { id },
    })
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const beob = beobResult?.data?.beobById
  const { wgs84Lat, wgs84Long, tpopId } = beob ?? {}
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
    await apolloClient.mutate({
      mutation: updateTpopById,
      variables: {
        id: tpopId,
        geomPoint,
      },
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
