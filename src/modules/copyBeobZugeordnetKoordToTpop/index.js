import get from 'lodash/get'

import queryBeob from './queryBeob'
import updateTpopById from './updateTpopById'

const copyBeobZugeordnetKoordToTpop = async ({ id, store, client }) => {
  // fetch beob coodinates
  let beobResult
  try {
    beobResult = await client.query({
      query: queryBeob,
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
  const beob = get(beobResult, 'data.beobById')
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
    await client.mutate({
      mutation: updateTpopById,
      variables: {
        id: tpopId,
        geomPoint,
      },
      // no optimistic responce as geomPoint
      /*optimisticResponse: {
        __typename: 'Mutation',
        updateTpopById: {
          tpop: {
            id: tpopId,
            __typename: 'Tpop',
          },
          __typename: 'Tpop',
        },
      },*/
    })
  } catch (error) {
    return store.enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
}

export default copyBeobZugeordnetKoordToTpop
