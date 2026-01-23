import { gql } from '@apollo/client'

import {
  store as jotaiStore,
  addNotificationAtom,
  apolloClientAtom,
} from '../store/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)


const tpopById = gql`
  query tpopById($id: UUID!) {
    tpopById(id: $id) {
      id
      lv95X
      lv95Y
    }
  }
`

export const getAndValidateCoordinatesOfTpop = async ({ id }) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  let tpopResult
  try {
    tpopResult = await apolloClient.query({
      query: tpopById,
      variables: { id },
    })
  } catch (error) {
    addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  const tpop = tpopResult?.data?.tpopById
  const { lv95X, lv95Y } = tpop
  if (!lv95X) {
    addNotification({
      message: `Die Teilpopulation mit der ID ${id} kat keine (vollständigen) Koordinaten`,
      options: {
        variant: 'warning',
      },
    })
    return { lv95X: null, lv95Y: null }
  }
  return { lv95X, lv95Y }
}
