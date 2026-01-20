import { gql } from '@apollo/client'

import { tpop } from '../../../shared/fragments.ts'
import { setStartjahr } from '../setStartjahr/index.tsx'
import { setEkplans } from '../setEkplans/index.tsx'
import {store as jotaiStore,
  tsQueryClientAtom,
  apolloClientAtom,
  enqueNotificationAtom} from '../../../../JotaiStore/index.ts'

export const processChange = async ({
  value,
  row,
  enqueNotification,
  store,
}) => {
  const tsQueryClient = jotaiStore.get(tsQueryClientAtom)
  const apolloClient = jotaiStore.get(apolloClientAtom)
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
        changedBy: store.user.name,
      },
    })
  } catch (error) {
    enqueNotification({
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
      store,
    })
  }
  // set ekplans if startjahr exists
  // TODO: or ekfrequenz has no kontrolljahre
  if (!!ekfrequenzStartjahr && !!value) {
    await setEkplans({
      tpopId: row.id,
      ekfrequenz: value,
      ekfrequenzStartjahr,
      store,
    })
  }
  // don't await as this would block the ui and it doesn't matter if user navigates away
  tsQueryClient.invalidateQueries({
    queryKey: ['RowQueryForEkPlan'],
  })

  return
}
