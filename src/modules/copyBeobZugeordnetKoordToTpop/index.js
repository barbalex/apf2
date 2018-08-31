// @flow
import get from 'lodash/get'
import app from 'ampersand-app'

import queryBeob from './queryBeob.graphql'
import updateTpopById from './updateTpopById.graphql'

export default async ({
  id,
  errorState,
}: {
  id: String,
  errorState: Object,
}): Promise<void> => {
  const { client } = app
  // fetch beob coodinates
  let beobResult
  try {
    beobResult = await client.query({
      query: queryBeob,
      variables: { id },
    })
  } catch (error) {
    return errorState.add(error)
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
    return errorState.add(error)
  }
}
