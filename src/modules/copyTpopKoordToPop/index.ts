import { queryTpop } from './queryTpop.ts'
import { updatePopById } from './updatePopById.ts'
import {
  store,
  apolloClientAtom,
  tsQueryClientAtom,
  addNotificationAtom,
  type Notification,
} from '../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const copyTpopKoordToPop = async ({ id }: { id: string }) => {
  const apolloClient = store.get(apolloClientAtom)!
  const tsQueryClient = store.get(tsQueryClientAtom)!
  // fetch tpop
  let tpopResult: Awaited<ReturnType<typeof apolloClient.query>> | undefined
  try {
    tpopResult = await apolloClient.query({
      query: queryTpop,
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
  const tpop = tpopResult?.data?.tpopById
  if (!tpop?.popId || !tpop?.geomPoint) {
    return addNotification({
      message:
        'Die Teil-Population hat keine Koordinaten oder keine Population',
      options: {
        variant: 'error',
      },
    })
  }
  const { geomPoint: geomPoint0, popId } = tpop

  // set pop coordinates
  try {
    let geomPoint = null
    if (geomPoint0.x) {
      geomPoint = {
        type: 'Point',
        coordinates: [geomPoint0.x, geomPoint0.y],
        // need to add crs otherwise PostGIS v2.5 (on server) errors
        crs: {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:EPSG::4326',
          },
        },
      }
    }
    await apolloClient.mutate({
      mutation: updatePopById,
      variables: {
        id: popId,
        geomPoint,
      },
      // no optimistic response as geomPoint
    })
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  tsQueryClient.invalidateQueries({
    queryKey: [`PopForMapQuery`],
  })
  tsQueryClient.invalidateQueries({
    queryKey: [`TpopForMapQuery`],
  })

  return
}
