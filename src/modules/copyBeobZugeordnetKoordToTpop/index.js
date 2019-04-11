import get from 'lodash/get'

import queryBeob from './queryBeob'
import updateTpopById from './updateTpopById'

export default async ({ id, addError, client }) => {
  // fetch beob coodinates
  let beobResult
  try {
    beobResult = await client.query({
      query: queryBeob,
      variables: { id },
    })
  } catch (error) {
    return addError(error)
  }
  const beob = get(beobResult, 'data.beobById')
  const { x, y, tpopId } = beob

  // set tpop coordinates
  try {
    await client.mutate({
      mutation: updateTpopById,
      variables: {
        id: tpopId,
        x,
        y,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateTpopById: {
          tpop: {
            id: tpopId,
            x,
            y,
            __typename: 'Tpop',
          },
          __typename: 'Tpop',
        },
      },
    })
  } catch (error) {
    return addError(error)
  }
}
