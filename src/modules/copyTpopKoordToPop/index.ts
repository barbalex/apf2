import { queryTpop } from './queryTpop.ts'
import { updatePopById } from './updatePopById.ts'
import {
  store,
  addNotificationAtom,
  type Notification,
  getApolloClientFromStore,
  getTsQueryClientFromStore,
} from '../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const copyTpopKoordToPop = async ({ id }: { id: string }) => {
  const apolloClient = getApolloClientFromStore()
  const tsQueryClient = getTsQueryClientFromStore()
  // fetch tpop
  let tpopResult
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
  void tsQueryClient.invalidateQueries({
    queryKey: [`PopForMapQuery`],
  })
  void tsQueryClient.invalidateQueries({
    queryKey: [`TpopForMapQuery`],
  })

  return
}
