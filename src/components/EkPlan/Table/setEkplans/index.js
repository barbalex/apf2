import get from 'lodash/get'

import queryEkplans from './queryEkplans'
import queryEkfrequenz from './queryEkfrequenz'
import mutationDeleteEkplan from './mutationDeleteEkplan'
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
  const notif = enqueNotification({
    message: `EK-Pläne werden berechnet...`,
    options: {
      variant: 'info',
      persist: true,
    },
  })
  // 1. query all ekplans beginning with ekfrequenzStartJahr
  let ekplansToDeleteResult
  try {
    ekplansToDeleteResult = await client.query({
      query: queryEkplans,
      fetchPolicy: 'network-only',
      variables: {
        tpopId,
        jahr: ekfrequenzStartjahr,
      },
    })
  } catch (error) {
    return store.enqueNotification({
      message: `Fehler beim Abfragen der bisherigen EK-Pläne: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  const ekplansToDelete = get(
    ekplansToDeleteResult,
    'data.allEkplans.nodes',
  ).map(e => e.id)
  // 2. delete them
  for (let id of ekplansToDelete) {
    try {
      await client.mutate({
        mutation: mutationDeleteEkplan,
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
  const ekfrequenz = get(ekfrequenzsResult, 'data.allEkfrequenzs.nodes.[0]')
  // 4. add kontrolljahre to ekplan
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
  // 5. tell user how it went
  removeNotification(notif)
  closeSnackbar(notif)
  let jahreList = kontrolljahre.join(', ')
  if (typeof window !== 'undefined') {
    const formatter = new Intl.ListFormat('de', {
      style: 'long',
      type: 'conjunction',
    })
    jahreList = formatter.format(kontrolljahre.map(j => j.toString()))
  }
  enqueNotification({
    message: `Ab ${ekfrequenzStartjahr} wurden die bestehenden EK-Pläne gelöscht und ab dem Startjahr ${ekfrequenzStartjahr} gemäss EK-Frequenz neue für ${
      kontrolljahre.length > 1 ? 'die Jahre' : 'das Jahr'
    } ${jahreList} gesetzt`,
    options: {
      variant: 'success',
    },
  })
  refetchTpop()
}
