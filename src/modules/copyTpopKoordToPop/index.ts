import { queryTpop } from './queryTpop.ts'
import { updatePopById } from './updatePopById.ts'
import {store as jotaiStore,
  apolloClientAtom,
  tsQueryClientAtom,
  addNotificationAtom} from '../../store/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)


export const copyTpopKoordToPop = async ({ id }) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  const tsQueryClient = jotaiStore.get(tsQueryClientAtom)
  // fetch tpop
  let tpopResult
  try {
    tpopResult = await apolloClient.query({
      query: queryTpop,
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
  const tpop = tpopResult?.data?.tpopById
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
      message: error.message,
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
