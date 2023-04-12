import { gql } from '@apollo/client'

const historizeForAp = async ({ store, year, apId }) => {
  const { enqueNotification, client } = store
  // 1. historize
  try {
    await client.mutate({
      mutation: gql`
        mutation historizeForAp($year: Int!, $apId: UUID!) {
          historizeForAp(
            input: { clientMutationId: "bla", year: $year, apId: $apId }
          ) {
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
  // 2. update materialized view
  await client.mutate({
    mutation: gql`
      mutation vApAuswPopMengeRefreshFromApberuebersicht {
        vApAuswPopMengeRefresh(input: { clientMutationId: "bla" }) {
          boolean
        }
        vPopAuswTpopMengeRefresh(input: { clientMutationId: "bla" }) {
          boolean
        }
      }
    `,
  })
  // notify user
  enqueNotification({
    message: `Art, Pop und TPop wurden für das Jahr ${year} historisiert`,
    options: {
      variant: 'success',
    },
  })
  return
}

export default historizeForAp
