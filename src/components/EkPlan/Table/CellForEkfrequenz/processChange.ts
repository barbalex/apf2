import { gql } from '@apollo/client'

import { tpop } from '../../../shared/fragments.ts'
import { setStartjahr } from '../setStartjahr/index.tsx'
import { setEkplans } from '../setEkplans/index.tsx'

export const processChange = async ({
  apolloClient,
  value,
  row,
  enqueNotification,
  store,
  tsQueryClient,
}) => {
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
      apolloClient,
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
      apolloClient,
      store,
    })
  }
  // don't await as this would block the ui and it doesn't matter if user navigates away
  tsQueryClient.invalidateQueries({
    queryKey: ['RowQueryForEkPlan'],
  })

  return
}
