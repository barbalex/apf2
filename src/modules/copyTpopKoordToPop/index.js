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
  const { x, y, popId } = tpop

  // set pop coordinates
  try {
    await client.mutate({
      mutation: updatePopById,
      variables: {
        id: popId,
        x,
        y,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePopById: {
          pop: {
            id: popId,
            x,
            y,
            __typename: 'Pop',
          },
          __typename: 'Pop',
        },
      },
    })
  } catch (error) {
    return addError(error)
  }
}
