import { gql } from '@apollo/client'

import {
  store as jotaiStore,
  apolloClientAtom,
  addNotificationAtom,
} from '../store/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)

export const historizeForAp = async ({ year, apId }) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)

  try {
    await apolloClient.mutate({
      mutation: gql`
        mutation historizeForAp($year: Int!, $apId: UUID!) {
          historizeForAp(input: { _year: $year, apId: $apId }) {
            boolean
          }
        }
      `,
      variables: {
        year,
        apId,
      },
    })
  } catch (error) {
    console.log('Error from mutating historize:', error)
    return addNotification({
      message: `Die Historisierung ist gescheitert. Fehlermeldung: ${error.message}`,
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
