import { gql } from '@apollo/client'

import {
  store as jotaiStore,
  enqueNotificationAtom,
} from '../JotaiStore/index.ts'
export const historizeForAp = async ({ store, year, apId }) => {
  const { apolloClient } = store  try {
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
    return jotaiStore.set(enqueNotificationAtom, {
      message: `Die Historisierung ist gescheitert. Fehlermeldung: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  // notify user
  jotaiStore.set(enqueNotificationAtom, {
    message: `Art, Pop und TPop wurden für das Jahr ${year} historisiert`,
    options: {
      variant: 'success',
    },
  })
  return
}
