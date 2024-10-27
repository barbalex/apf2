import { gql } from '@apollo/client'

export const historizeForAp = async ({ store, year, apId }) => {
  const { enqueNotification, client } = store
  try {
    await client.mutate({
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
    return enqueNotification({
      message: `Die Historisierung ist gescheitert. Fehlermeldung: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  // notify user
  enqueNotification({
    message: `Art, Pop und TPop wurden für das Jahr ${year} historisiert`,
    options: {
      variant: 'success',
    },
  })
  return
}
