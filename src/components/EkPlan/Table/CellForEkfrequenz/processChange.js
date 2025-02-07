import { gql } from '@apollo/client'

import { tpop } from '../../../shared/fragments.js'
import { setStartjahr } from '../setStartjahr/index.jsx'
import { setEkplans } from '../setEkplans/index.jsx'

export const processChange = async ({
  client,
  value,
  row,
  enqueNotification,
  store,
  refetchTpop,
}) => {
  try {
    await client.mutate({
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
      refetchQueries: ['EkplanTpopQuery'],
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
      client,
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
      refetchTpop,
      client,
      store,
    })
  }
  // don't await as this would block the ui and it doesn't matter if user navigates away
  client.refetchQueries({ include: ['EkplanCellForYearQuery'] })
  return
}
