import { gql } from '@apollo/client'

import { tpop } from '../../../shared/fragments.ts'
import { setStartjahr } from '../setStartjahr/index.ts'
import { setEkplans } from '../setEkplans/index.ts'
import {
  store,
  tsQueryClientAtom,
  apolloClientAtom,
  addNotificationAtom,
  userNameAtom,
} from '../../../../store/index.ts'

const addNotification = (notification) =>
  store.set(addNotificationAtom, notification)

export const processChange = async ({ value, row }) => {
  const tsQueryClient = store.get(tsQueryClientAtom)
  const apolloClient = store.get(apolloClientAtom)
  try {
    await apolloClient.mutate({
      mutation: gql`
        mutation updateTpopEkfrequenz(
          $id: UUID!
          $ekfrequenz: UUID
          $changedBy: String
        ) {
          updateTpopById(
            input: {
              id: $id
              tpopPatch: {
                id: $id
                ekfrequenz: $ekfrequenz
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
        ekfrequenz: value,
        changedBy: store.get(userNameAtom),
      },
    })
  } catch (error) {
    return addNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  // set EK-Frequenz Startjahr
  let ekfrequenzStartjahr
  if (value) {
    ekfrequenzStartjahr = await setStartjahr({
      row,
      ekfrequenz: value,
    })
  }
  // set ekplans if startjahr exists
  // TODO: or ekfrequenz has no kontrolljahre
  if (!!ekfrequenzStartjahr && !!value) {
    await setEkplans({
      tpopId: row.id,
      ekfrequenz: value,
      ekfrequenzStartjahr,
    })
  }
  // don't await as this would block the ui and it doesn't matter if user navigates away
  tsQueryClient.invalidateQueries({
    queryKey: ['RowQueryForEkPlan'],
  })

  return
}
