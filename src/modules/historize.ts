import { gql } from '@apollo/client'
import { DateTime } from 'luxon'

import { apberuebersicht } from '../components/shared/fragments.ts'
import {
  store,
  apolloClientAtom,
  addNotificationAtom,
} from '../store/index.ts'

const addNotification = (notification) =>
  store.set(addNotificationAtom, notification)

export const historize = async ({ apberuebersicht: row }) => {
  const apolloClient = store.get(apolloClientAtom)
  // 1. historize
  try {
    await apolloClient.mutate({
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
    return addNotification({
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
    await apolloClient.mutate({
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
    return addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  // notify user
  addNotification({
    message: `Arten, Pop und TPop wurden für das Jahr ${row?.jahr} historisiert`,
    options: {
      variant: 'success',
    },
  })
  return
}
