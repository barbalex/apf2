import get from 'lodash/get'

import queryTpop from './queryTpop'
import updatePopById from './updatePopById'

export default async ({ id, addError, client }) => {
  // fetch tpop
  let tpopResult
  try {
    tpopResult = await client.query({
      query: queryTpop,
      variables: { id },
    })
  } catch (error) {
    return addError(error)
  }
  const tpop = get(tpopResult, 'data.tpopById')
  const { geomPoint, popId } = tpop

  // set pop coordinates
  try {
    await client.mutate({
      mutation: updatePopById,
      variables: {
        id: popId,
        geomPoint,
      },
      // no optimistic responce as geomPoint
    })
  } catch (error) {
    return addError(error)
  }
}
