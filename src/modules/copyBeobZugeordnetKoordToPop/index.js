// @flow
import get from 'lodash/get'
import app from 'ampersand-app'

import listError from '../listError'
import queryBeob from './queryBeob.graphql'
import queryTpop from './queryTpop.graphql'
import updatePopById from './updatePopById.graphql'

export default async (id: String): Promise<void> => {
  const { client } = app
  // fetch beob coodinates
  let beobResult
  try {
    beobResult = await client.query({
      query: queryBeob,
      variables: { id }
    })
  } catch(error) {
    return listError(error)
  }
  const beob = get(beobResult, 'data.beobById')
  const { x, y, tpopId } = beob

  // fetch popId
  let tpopResult
  try {
    tpopResult = await client.query({
      query: queryTpop,
      variables: { id: tpopId }
    })
  } catch (error) {
    return listError(error)
  }
  const popId = get(tpopResult, 'data.tpopById.popId')

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
    return listError(error)
  }
}
