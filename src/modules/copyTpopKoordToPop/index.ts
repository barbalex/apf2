import { queryTpop } from './queryTpop.ts'
import { updatePopById } from './updatePopById.ts'

export const copyTpopKoordToPop = async ({ id, store, apolloClient }) => {
  // fetch tpop
  let tpopResult
  try {
    tpopResult = await apolloClient.query({
      query: queryTpop,
      variables: { id },
    })
  } catch (error) {
    return store.enqueNotification({
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
      // no optimistic responce as geomPoint
    })
  } catch (error) {
    return store.enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  store.tsQueryClient.invalidateQueries({
    queryKey: [`PopForMapQuery`],
  })
  store.tsQueryClient.invalidateQueries({
    queryKey: [`TpopForMapQuery`],
  })

  return
}
