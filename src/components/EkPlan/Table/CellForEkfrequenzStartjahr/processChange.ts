import { gql } from '@apollo/client'

import { tpop } from '../../../shared/fragments.ts'
import { setEkplans } from '../setEkplans/index.ts'
import {
  store as jotaiStore,
  apolloClientAtom,
  tsQueryClientAtom,
  addNotificationAtom,
  userNameAtom,
} from '../../../../store/index.ts'

const addNotification = (notification) =>
  jotaiStore.set(addNotificationAtom, notification)

export const processChange = async ({ value, ekfrequenz, row }) => {
  const apolloClient = jotaiStore.get(apolloClientAtom)
  const tsQueryClient = jotaiStore.get(tsQueryClientAtom)
  try {
    await apolloClient.mutate({
      mutation: gql`
        mutation updateTpopEkfrequenzStartjahr(
          $id: UUID!
          $ekfrequenzStartjahr: Int
          $changedBy: String
        ) {
          updateTpopById(
            input: {
              id: $id
              tpopPatch: {
                id: $id
                ekfrequenzStartjahr: $ekfrequenzStartjahr
                changedBy: $changedBy
              }
            }
          ) {
            tpop {
              ...TpopFields
            }
          }
        }
        ${tpop}
      `,
      variables: {
        id: row.id,
        ekfrequenzStartjahr: value,
        changedBy: jotaiStore.get(userNameAtom),
      },
    })
  } catch (error) {
    addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }

  await setEkplans({
    tpopId: row.id,
    ekfrequenz,
    ekfrequenzStartjahr: value,
  })

  // don't await as this would block the ui and it doesn't matter if user navigates away
  tsQueryClient.invalidateQueries({
    queryKey: ['RowQueryForEkPlan'],
  })

  return
}
