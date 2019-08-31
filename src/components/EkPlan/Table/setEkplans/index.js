import get from 'lodash/get'

import queryEkplans from './queryEkplans'
import queryEkfrequenz from './queryEkfrequenz'
import mutationDeleteEkplans from './mutationDeleteEkplans'

export default async ({
  tpopId,
  ekfrequenzCode,
  ekfrequenzStartjahr,
  refetchTpop,
  client,
  store,
}) => {
  console.log('TODO: set ekplan', {
    tpopId,
    ekfrequenzCode,
    ekfrequenzStartjahr,
  })
  // 1. query all ekplans beginning with ekfrequenzStartJahr
  let ekplansToDeleteResult
  try {
    ekplansToDeleteResult = await client.query({
      query: queryEkplans,
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
  ekplansToDelete.forEach(id => {
    try {
      client.mutate({
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
  })
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
  const kontrolljahre = get(ekfrequenzsResult, 'data.allEkfrequenzs.nodes').map(
    e => e.kontrolljahre,
  )
  console.log('setEkplans, kontrolljahre:', kontrolljahre)
  // 4. add kontrolljahre to ekplan
  // 5. tell user how it went
  setTimeout(() => refetchTpop())
}
