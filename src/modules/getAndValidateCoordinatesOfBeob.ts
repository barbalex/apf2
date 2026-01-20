import { gql } from '@apollo/client'

import {
  store as jotaiStore,
  addNotificationAtom,
  apolloClientAtom,
} from '../JotaiStore/index.ts'

const beobById = gql`
  query beobById($id: UUID!) {
    beobById(id: $id) {
      id
      lv95X
      lv95Y
    }
  }
`

export const getAndValidateCoordinatesOfBeob = async ({ id }) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  let beobResult
  try {
    beobResult = await apolloClient.query({
      query: beobById,
      variables: { id },
    })
  } catch (error) {
    jotaiStore.set(addNotificationAtom, {
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const beob = beobResult?.data?.beobById
  const lv95X = beob?.lv95X
  const lv95Y = beob?.lv95Y
  if (!lv95X) {
    jotaiStore.set(addNotificationAtom, {
      message: `Die Teilpopulation mit der ID ${id} kat keine (vollständigen) Koordinaten`,
      options: {
        variant: 'error',
      },
    })
    return { lv95X: null, lv95Y: null }
  }
  return { lv95X, lv95Y }
}
