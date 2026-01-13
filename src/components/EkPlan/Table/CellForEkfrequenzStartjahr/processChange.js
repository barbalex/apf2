import { gql } from '@apollo/client'

import { tpop } from '../../../shared/fragments.js'
import { setEkplans } from '../setEkplans/index.tsx'

export const processChange = async ({
  apolloClient,
  value,
  ekfrequenz,
  row,
  enqueNotification,
  store,
  tsQueryClient,
}) => {
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

  await setEkplans({
    tpopId: row.id,
    ekfrequenz,
    ekfrequenzStartjahr: value,
    apolloClient,
    store,
  })

  // don't await as this would block the ui and it doesn't matter if user navigates away
  tsQueryClient.invalidateQueries({
    queryKey: ['RowQueryForEkPlan'],
  })

  return
}
