import get from 'lodash/get'
import max from 'lodash/max'

import queryEkfrequenz from './queryEkfrequenz'
import mutationUpdateTpop from './mutationUpdateTpop'
import { value } from 'pg-sql2'

export default async ({ tpopId, row, ekfrequenzCode, client, store }) => {
  const { enqueNotification } = store
  // 1  get ekfrequenz's kontrolljahreAb
  let ekfrequenzResult
  try {
    ekfrequenzResult = await client.query({
      query: queryEkfrequenz,
      variables: {
        code: ekfrequenzCode,
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
    'data.ekfrequenzByCode.kontrolljahreAb',
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
      get(row, 'tpopkontrsByTpopId.nodes', []).map(n => n.jahr),
    )
  }
  // 2b if ansiedlung: get last ansiedlung
  if (kontrolljahreAb === 'ANSIEDLUNG') {
    ekfrequenzStartjahr = max(
      get(row, 'tpopmassnsByTpopId.nodes', []).map(n => n.jahr),
    )
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
  // 4 return startjahr
  return ekfrequenzStartjahr
}
