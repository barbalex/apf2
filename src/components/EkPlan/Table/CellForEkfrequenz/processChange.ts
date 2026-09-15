import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { tpop } from '../../../shared/fragments.ts'
import { setStartjahr } from '../setStartjahr/index.ts'
import { setEkplans } from '../setEkplans/index.ts'
import type { TpopRow } from '../tableTypes.ts'
import {
  store,
  tsQueryClientAtom,
  apolloClientAtom,
  addNotificationAtom,
  userNameAtom,
  type Notification,
} from '../../../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const processChange = async ({
  value,
  row,
}: {
  value: string | null
  row: TpopRow
}) => {
  const tsQueryClient = store.get(tsQueryClientAtom)
  const apolloClient = store.get(apolloClientAtom)
  if (!tsQueryClient || !apolloClient) return
  try {
    await apolloClient.mutate({
      mutation: dynamicGql`
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
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  // set EK-Frequenz Startjahr
  let ekfrequenzStartjahr: number | null | undefined
  if (value) {
    ekfrequenzStartjahr = (await setStartjahr({
      row,
      ekfrequenz: value,
    })) ?? null
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
  void tsQueryClient.invalidateQueries({
    queryKey: ['RowQueryForEkPlan'],
  })

  return
}
