import { queryBeob } from './queryBeob.ts'
import { updateTpopById } from './updateTpopById.ts'

import {
  store as jotaiStore,
  addNotificationAtom,
  apolloClientAtom,
} from '../../store/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)

export const copyBeobZugeordnetKoordToTpop = async ({ id }) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  // fetch beob coodinates
  let beobResult
  try {
    beobResult = await apolloClient.query({
      query: queryBeob,
      variables: { id },
    })
  } catch (error) {
    return addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const beob = beobResult?.data?.beobById
  const { wgs84Lat, wgs84Long, tpopId } = beob
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
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  return
}
