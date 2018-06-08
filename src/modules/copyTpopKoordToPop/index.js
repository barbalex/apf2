// @flow
import get from 'lodash/get'
import app from 'ampersand-app'

import queryTpop from './queryTpop.graphql'
import updatePopById from './updatePopById.graphql'

export default async ({
  id,
  errorState,
}:{
  id: String,
  errorState:Object,
}): Promise<void> => {
  const { client } = app

  // fetch tpop
  let tpopResult
  try {
    tpopResult = await client.query({
      query: queryTpop,
      variables: { id }
    })
  } catch (error) {
    return errorState.add(error)
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
        y
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
    return errorState.add(error)
  }
}
