import queryTpop from './queryTpop'
import updatePopById from './updatePopById'

const copyTpopKoordToPop = async ({ id, store, client }) => {
  const { refetch } = store
  // fetch tpop
  let tpopResult
  try {
    tpopResult = await client.query({
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
    await client.mutate({
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
  if (refetch.popForMap) refetch.popForMap()
  if (refetch.tpopForMap) refetch.tpopForMap()
}

export default copyTpopKoordToPop
