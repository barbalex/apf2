import get from 'lodash/get'
import max from 'lodash/max'

import queryEkfrequenz from './queryEkfrequenz'
import mutationUpdateTpop from './mutationUpdateTpop'

export default async ({ row, ekfrequenz, client, store }) => {
  const { enqueNotification } = store
  // 1  get ekfrequenz's kontrolljahreAb
  let ekfrequenzResult
  try {
    ekfrequenzResult = await client.query({
      query: queryEkfrequenz,
      variables: {
        id: ekfrequenz,
      },
    })
  } catch (error) {
    return enqueNotification({
      message: `Fehler beim Abfragen der EK-Frequenz: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  const kontrolljahreAb = get(
    ekfrequenzResult,
    'data.ekfrequenzById.kontrolljahreAb',
    null,
  )
  if (!kontrolljahreAb) {
    return enqueNotification({
      message: `Bei der gewählten EK-Frequenz wurde das Feld 'Kontrolljahre ab' nicht erfasst. Daher konnte das Startjahr nicht berechnet werden`,
      options: {
        variant: 'error',
      },
    })
  }
  let ekfrequenzStartjahr
  // 2a if ek: get last ek
  if (kontrolljahreAb === 'EK') {
    ekfrequenzStartjahr = max(
      get(row, 'tpop.tpopkontrsByTpopId.nodes', []).map(n => n.jahr),
    )
    if (!ekfrequenzStartjahr) {
      return enqueNotification({
        message: `Offenbar gibt es keine Kontrolle. Daher kann das EK-Frequenz-Startjahr nicht gesetzt werden`,
        options: {
          variant: 'info',
        },
      })
    }
  }
  // 2b if ansiedlung: get last ansiedlung
  if (kontrolljahreAb === 'ANSIEDLUNG') {
    ekfrequenzStartjahr = max(
      get(row, 'tpop.tpopmassnsByTpopId.nodes', []).map(n => n.jahr),
    )
    if (!ekfrequenzStartjahr) {
      return enqueNotification({
        message: `Offenbar gibt es keine Ansiedlung. Daher kann das EK-Frequenz-Startjahr nicht gesetzt werden`,
        options: {
          variant: 'info',
        },
      })
    }
  }
  // 3 set tpop.ekfrequenzStartjahr
  try {
    await client.mutate({
      mutation: mutationUpdateTpop,
      variables: {
        id: row.id,
        ekfrequenzStartjahr,
        changedBy: store.user.name,
      },
    })
  } catch (error) {
    return store.enqueNotification({
      message: `Fehler beim Aktualisieren der Teil-Population: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  // 4inform user
  const message =
    kontrolljahreAb === 'EK'
      ? `Entsprechend der letzten Kontrolle wird als EK-Frequenz-Startjahr ${ekfrequenzStartjahr} gesetzt`
      : `Entsprechend der letzten Ansiedlung wird als EK-Frequenz-Startjahr ${ekfrequenzStartjahr} gesetzt`
  enqueNotification({
    message,
    options: {
      variant: 'success',
    },
  })
  // 5 return startjahr
  return ekfrequenzStartjahr
}
