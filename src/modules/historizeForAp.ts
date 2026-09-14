import { graphql } from '../gql'

import {
  store,
  apolloClientAtom,
  addNotificationAtom,
  type Notification,
} from '../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const historizeForAp = async ({
  year,
  apId,
}: {
  year: number
  apId: string
}) => {
  const apolloClient = store.get(apolloClientAtom)!

  try {
    await apolloClient.mutate({
      mutation: graphql(`
        mutation historizeForAp($year: Int!, $apId: UUID!) {
          historizeForAp(input: { _year: $year, apId: $apId }) {
            boolean
          }
        }
      `),
      variables: {
        year,
        apId,
      },
    })
  } catch (error) {
    console.log('Error from mutating historize:', error)
    return addNotification({
      message: `Die Historisierung ist gescheitert. Fehlermeldung: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }

  // notify user
  addNotification({
    message: `Art, Pop und TPop wurden für das Jahr ${year} historisiert`,
    options: {
      variant: 'success',
    },
  })

  return
}
