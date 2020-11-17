import get from 'lodash/get'

import queryEkplans from './queryEkplans'
import queryEkfrequenz from './queryEkfrequenz'
import mutationDeleteEkplan from './mutationDeleteEkplan'
import mutationCreateEkplan from './mutationCreateEkplan'

export default async ({
  tpopId,
  ekfrequenz: ekfrequenzValue,
  ekfrequenzStartjahr,
  refetchTpop,
  client,
  store,
  closeSnackbar,
}) => {
  // TODO:
  // only return if set ekfrequenz has kontrolljahre?
  // but then: query ekplans beginning when? This year
  console.log('setEkplans', { ekfrequenzValue })
  if (!ekfrequenzStartjahr) return
  const { enqueNotification } = store
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
    return enqueNotification({
      message: `Fehler beim Abfragen der bisherigen EK-Pläne: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  const ekplansToDelete = get(
    ekplansToDeleteResult,
    'data.allEkplans.nodes',
  ).map((e) => e.id)
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
      return enqueNotification({
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
        id: ekfrequenzValue,
      },
    })
  } catch (error) {
    return enqueNotification({
      message: `Fehler beim Abfragen der Kontrolljahre: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  const ekfrequenz = get(ekfrequenzsResult, 'data.allEkfrequenzs.nodes.[0]')
  // 4. add kontrolljahre to ekplan
  const typ = ekfrequenz.ektyp.toUpperCase()
  const kontrolljahre = ekfrequenz.kontrolljahre || []
  if (kontrolljahre.length === 0) {
    refetchTpop()
    return enqueNotification({
      message: `Ab ${ekfrequenzStartjahr} wurden die bestehenden EK-Pläne gelöscht. Weil aber für die gewählte EK-Frequenz keine Kontrolljahre existieren, wurden keine neuen Kontrolljahre gesetzt`,
      options: {
        variant: 'info',
      },
    })
  }
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
      return enqueNotification({
        message: `Fehler beim Schaffen neuer EK-Pläne: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }
  }
  // 5. tell user how it went
  let jahreList = kontrolljahre.join(', ')
  if (typeof window !== 'undefined') {
    const formatter = new Intl.ListFormat('de', {
      style: 'long',
      type: 'conjunction',
    })
    jahreList = formatter.format(kontrolljahre.map((j) => j.toString()))
  }
  enqueNotification({
    message: `Ab ${ekfrequenzStartjahr} wurden allfällige bestehende EK-Pläne gelöscht und gemäss EK-Frequenz neue für ${
      kontrolljahre.length > 1 ? 'die Jahre' : 'das Jahr'
    } ${jahreList} gesetzt`,
    options: {
      variant: 'success',
    },
  })
  refetchTpop()
}
