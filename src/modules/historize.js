import { gql } from '@apollo/client'
import { DateTime } from 'luxon'

import { apberuebersicht } from '../components/shared/fragments'

const historize = async ({ store, apberuebersicht: row }) => {
  const { enqueNotification, client } = store
  // 1. historize
  console.log('historize', { row, year: row?.jahr })
  try {
    await client.mutate({
      mutation: gql`
        mutation historize($year: Int!) {
          historize(input: { _year: $year }) {
            boolean
          }
        }
      `,
      variables: {
        year: row?.jahr,
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
  // 2. if it worked: mutate historyDate
  try {
    const variables = {
      id: row?.id,
      historyDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
    }
    await client.mutate({
      mutation: gql`
        mutation updateApberuebersichtForHistoryDate(
          $id: UUID!
          $historyDate: Date
        ) {
          updateApberuebersichtById(
            input: {
              id: $id
              apberuebersichtPatch: { historyDate: $historyDate }
            }
          ) {
            apberuebersicht {
              ...ApberuebersichtFields
            }
          }
        }
        ${apberuebersicht}
      `,
      variables,
    })
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  // notify user
  enqueNotification({
    message: `Arten, Pop und TPop wurden für das Jahr ${row?.jahr} historisiert`,
    options: {
      variant: 'success',
    },
  })
  return
}

export default historize
