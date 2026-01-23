import { queryEkplans } from './queryEkplans.js'
import { queryEkfrequenz } from './queryEkfrequenz.js'
import { mutationDeleteEkplan } from './mutationDeleteEkplan.js'
import { mutationCreateEkplan } from './mutationCreateEkplan.js'
import {
  store,
  apolloClientAtom,
  addNotificationAtom,
} from '../../../../store/index.js'

const addNotification = (notification) =>
  store.set(addNotificationAtom, notification)

export const setEkplans = async ({
  tpopId,
  ekfrequenz: ekfrequenzValue,
  ekfrequenzStartjahr,
}) => {
  const apolloClient = store.get(apolloClientAtom)
  // TODO:
  // only return if set ekfrequenz has kontrolljahre?
  // but then: query ekplans beginning when? This year
  //console.log('setEkplans', { ekfrequenzValue })
  if (!ekfrequenzStartjahr) return // 1. query all ekplans beginning with ekfrequenzStartJahr
  let ekplansToDeleteResult
  try {
    ekplansToDeleteResult = await apolloClient.query({
      query: queryEkplans,
      fetchPolicy: 'network-only',
      variables: {
        tpopId,
        jahr: ekfrequenzStartjahr,
      },
    })
  } catch (error) {
    return addNotification({
      message: `Fehler beim Abfragen der bisherigen EK-Pläne: ${error.message}`,
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
        message: `Fehler beim Löschen der bisherigen EK-Pläne: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }
  }
  // 3. fetch ekfrequenz.kontrolljahre for this tpop.ekfrequenz
  let ekfrequenzsResult
  try {
    ekfrequenzsResult = await apolloClient.query({
      query: queryEkfrequenz,
      variables: {
        id: ekfrequenzValue,
      },
    })
  } catch (error) {
    return addNotification({
      message: `Fehler beim Abfragen der Kontrolljahre: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  const ekfrequenz = ekfrequenzsResult?.data?.allEkfrequenzs?.nodes?.[0]
  // 4. add kontrolljahre to ekplan
  const typ = ekfrequenz.ektyp.toUpperCase()
  const kontrolljahre = ekfrequenz.kontrolljahre || []
  if (kontrolljahre.length === 0) {
    return addNotification({
      message: `Ab ${ekfrequenzStartjahr} wurden die bestehenden EK-Pläne gelöscht. Weil aber für die gewählte EK-Frequenz keine Kontrolljahre existieren, wurden keine neuen Kontrolljahre gesetzt`,
      options: {
        variant: 'info',
      },
    })
  }
  // parallel execution:
  const mutationPromises = kontrolljahre.map((jahr) =>
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
      message: `Fehler beim Schaffen neuer EK-Pläne: ${error.message}`,
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
