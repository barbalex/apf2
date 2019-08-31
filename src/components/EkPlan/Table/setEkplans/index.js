import get from 'lodash/get'

import queryEkplans from './queryEkplans'
import queryEkfrequenz from './queryEkfrequenz'
import mutationDeleteEkplans from './mutationDeleteEkplans'
import mutationCreateEkplan from './mutationCreateEkplan'

export default async ({
  tpopId,
  ekfrequenzCode,
  ekfrequenzStartjahr,
  refetchTpop,
  client,
  store,
  closeSnackbar,
}) => {
  const { enqueNotification, removeNotification } = store
  console.log('TODO: set ekplan', {
    tpopId,
    ekfrequenzCode,
    ekfrequenzStartjahr,
  })
  const notif = enqueNotification({
    message: `EK-Pläne werden ab ${ekfrequenzStartjahr} gesetzt...`,
    options: {
      variant: 'info',
      persist: true,
    },
  })
  // 1. query all ekplans beginning with ekfrequenzStartJahr
  let ekplansToDeleteResult
  console.log('setEkplans 01')
  try {
    console.log('setEkplans 02')
    ekplansToDeleteResult = await client.query({
      query: queryEkplans,
      fetchPolicy: 'network-only',
      variables: {
        tpopId,
        jahr: ekfrequenzStartjahr,
      },
    })
    console.log('setEkplans 03')
  } catch (error) {
    console.log('setEkplans 04')
    return store.enqueNotification({
      message: `Fehler beim Abfragen der bisherigen EK-Pläne: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  console.log('setEkplans 05')
  const ekplansToDelete = get(
    ekplansToDeleteResult,
    'data.allEkplans.nodes',
  ).map(e => e.id)
  console.log('setEkplans 1', { ekplansToDelete, ekplansToDeleteResult })
  // 2. delete them
  for (let id of ekplansToDelete) {
    try {
      await client.mutate({
        mutation: mutationDeleteEkplans,
        variables: {
          id,
        },
      })
    } catch (error) {
      return store.enqueNotification({
        message: `Fehler beim Löschen der bisherigen EK-Pläne: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }
  }
  console.log('setEkplans 2')
  // 3. fetch ekfrequenz.kontrolljahre for this tpop.ekfrequenz
  let ekfrequenzsResult
  try {
    ekfrequenzsResult = await client.query({
      query: queryEkfrequenz,
      variables: {
        code: ekfrequenzCode,
      },
    })
  } catch (error) {
    return store.enqueNotification({
      message: `Fehler beim Abfragen der Kontrolljahre: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  const ekfrequenzen = get(ekfrequenzsResult, 'data.allEkfrequenzs.nodes')
  console.log('setEkplans 3, ekfrequenzen:', ekfrequenzen)
  // 4. add kontrolljahre to ekplan
  for (let ekfrequenz of ekfrequenzen) {
    const typ = ekfrequenz.ek ? 'EK' : 'EKF'
    const kontrolljahre = ekfrequenz.kontrolljahre
    for (let jahr of kontrolljahre) {
      try {
        await client.mutate({
          mutation: mutationCreateEkplan,
          variables: {
            tpopId,
            jahr: jahr + ekfrequenzStartjahr,
            typ,
          },
        })
      } catch (error) {
        return store.enqueNotification({
          message: `Fehler beim Schaffen neuer EK-Pläne: ${error.message}`,
          options: {
            variant: 'error',
          },
        })
      }
    }
  }
  console.log('setEkplans 4')
  // 5. tell user how it went
  removeNotification(notif)
  closeSnackbar(notif)
  enqueNotification({
    message: `Ab ${ekfrequenzStartjahr} wurden die bestehenden EK-Pläne gelöscht und gemäss EK-Frequenz (Kontrolljahre) neue gesetzt`,
    options: {
      variant: 'success',
    },
  })
  refetchTpop()
  //setTimeout(() => refetchTpop())
}
