import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { tpop } from '../../../shared/fragments.ts'
import { setEkplans } from '../setEkplans/index.ts'
import type { EkfrequenzId } from '../../../../models/apflora/Ekfrequenz.ts'
import type { TpopRow } from '../tableTypes.ts'
import {
  store,
  apolloClientAtom,
  tsQueryClientAtom,
  addNotificationAtom,
  userNameAtom,
  type Notification,
} from '../../../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const processChange = async ({
  value,
  ekfrequenz,
  row,
}: {
  value: number | null
  ekfrequenz: EkfrequenzId | null | undefined
  row: TpopRow
}) => {
  const apolloClient = store.get(apolloClientAtom)
  const tsQueryClient = store.get(tsQueryClientAtom)
  if (!apolloClient || !tsQueryClient) return
  try {
    await apolloClient.mutate({
      mutation: dynamicGql`
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
        changedBy: store.get(userNameAtom),
      },
    })
  } catch (error) {
    addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }

  await setEkplans({
    tpopId: row.id,
    ekfrequenz: ekfrequenz ?? null,
    ekfrequenzStartjahr: value,
  })

  // don't await as this would block the ui and it doesn't matter if user navigates away
  void tsQueryClient.invalidateQueries({
    queryKey: ['RowQueryForEkPlan'],
  })

  return
}
