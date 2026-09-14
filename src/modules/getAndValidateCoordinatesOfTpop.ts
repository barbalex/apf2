import { graphql } from '../gql'

import {
  store,
  addNotificationAtom,
  apolloClientAtom,
  type Notification,
} from '../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

const tpopById = graphql(`
  query tpopById($id: UUID!) {
    tpopById(id: $id) {
      id
      lv95X
      lv95Y
    }
  }
`)

export const getAndValidateCoordinatesOfTpop = async ({
  id,
}: {
  id: string
}) => {
  const apolloClient = store.get(apolloClientAtom)!
  let tpopResult
  try {
    tpopResult = await apolloClient.query({
      query: tpopById,
      variables: { id },
    })
  } catch (error) {
    addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const tpop = tpopResult?.data?.tpopById
  const { lv95X, lv95Y } = tpop ?? {}
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
