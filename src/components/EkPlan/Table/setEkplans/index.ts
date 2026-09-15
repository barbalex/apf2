import { queryEkplans } from './queryEkplans.ts'
import { queryEkfrequenz } from './queryEkfrequenz.ts'
import { mutationDeleteEkplan } from './mutationDeleteEkplan.ts'
import { mutationCreateEkplan } from './mutationCreateEkplan.ts'
import {
  store,
  apolloClientAtom,
  addNotificationAtom,
  type Notification,
} from '../../../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const setEkplans = async ({
  tpopId,
  ekfrequenz: ekfrequenzValue,
  ekfrequenzStartjahr,
}: {
  tpopId: string
  ekfrequenz: string | null
  ekfrequenzStartjahr: number | null
}) => {
  const apolloClient = store.get(apolloClientAtom)
  if (!apolloClient) return
  // TODO:
  // only return if set ekfrequenz has kontrolljahre?
  // but then: query ekplans beginning when? This year
  //console.log('setEkplans', { ekfrequenzValue })
  if (!ekfrequenzStartjahr) return // 1. query all ekplans beginning with ekfrequenzStartJahr
  let ekplansToDeleteResult:
    | {
        data?:
          | { allEkplans?: { nodes?: { id: string }[] } }
          | undefined
      }
    | undefined
  try {
    ekplansToDeleteResult = (await apolloClient.query({
      query: queryEkplans,
      fetchPolicy: 'network-only',
      variables: {
        tpopId,
        jahr: ekfrequenzStartjahr,
      },
    })) as typeof ekplansToDeleteResult
  } catch (error) {
    return addNotification({
      message: `Fehler beim Abfragen der bisherigen EK-Pläne: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }
  const ekplansToDelete = (
    ekplansToDeleteResult?.data?.allEkplans?.nodes ?? []
  ).map((e) => e.id)
  // 2. delete them
  for (const id of ekplansToDelete) {
    try {
      await apolloClient.mutate({
        mutation: mutationDeleteEkplan,
        variables: {
          id,
        },
      })
    } catch (error) {
      return addNotification({
        message: `Fehler beim Löschen der bisherigen EK-Pläne: ${(error as Error).message}`,
        options: {
          variant: 'error',
        },
      })
    }
  }
  // 3. fetch ekfrequenz.kontrolljahre for this tpop.ekfrequenz
  let ekfrequenzsResult:
    | {
        data?:
          | {
              allEkfrequenzs?: {
                nodes?: { ektyp: string; kontrolljahre: number[] | null }[]
              }
            }
          | undefined
      }
    | undefined
  try {
    ekfrequenzsResult = (await apolloClient.query({
      query: queryEkfrequenz,
      variables: {
        id: ekfrequenzValue ?? '',
      },
    })) as typeof ekfrequenzsResult
  } catch (error) {
    return addNotification({
      message: `Fehler beim Abfragen der Kontrolljahre: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }
  const ekfrequenz = ekfrequenzsResult?.data?.allEkfrequenzs?.nodes?.[0]
  if (!ekfrequenz) return
  // 4. add kontrolljahre to ekplan
  const typ = ekfrequenz.ektyp.toUpperCase()
  const kontrolljahre: number[] = ekfrequenz.kontrolljahre || []
  if (kontrolljahre.length === 0) {
    return addNotification({
      message: `Ab ${ekfrequenzStartjahr} wurden die bestehenden EK-Pläne gelöscht. Weil aber für die gewählte EK-Frequenz keine Kontrolljahre existieren, wurden keine neuen Kontrolljahre gesetzt`,
      options: {
        variant: 'info',
      },
    })
  }
  // parallel execution:
  const mutationPromises = kontrolljahre.map((jahr: number) =>
    apolloClient.mutate({
      mutation: mutationCreateEkplan,
      variables: {
        tpopId,
        jahr: jahr + ekfrequenzStartjahr,
        typ,
      },
    }),
  )
  // await all mutations
  try {
    await Promise.all(mutationPromises)
  } catch (error) {
    return addNotification({
      message: `Fehler beim Schaffen neuer EK-Pläne: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }
  // 5. tell user how it went
  // let jahreList = kontrolljahre.join(', ')
  // const formatter = new Intl.ListFormat('de', {
  //   style: 'long',
  //   type: 'conjunction',
  // })
  // jahreList = formatter.format(kontrolljahre.map((j) => j.toString()))
  // addNotification({
  //   message: `Ab ${ekfrequenzStartjahr} wurden allfällige bestehende EK-Pläne gelöscht und gemäss EK-Frequenz neue für ${
  //     kontrolljahre.length > 1 ? 'die Jahre' : 'das Jahr'
  //   } ${jahreList} gesetzt`,
  //   options: {
  //     variant: 'success',
  //   },
  // })

  return
}
