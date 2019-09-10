import get from 'lodash/get'
import max from 'lodash/max'

import queryEkfrequenz from './queryEkfrequenz'

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
  let startjahr
  // 2a if ek: get last ek
  if (kontrolljahreAb === 'EK') {
    startjahr = max(get(row, 'tpopkontrsByTpopId.nodes', []).map(n => n.jahr))
  }
  // 2b if ansiedlung: get last ansiedlung
  if (kontrolljahreAb === 'ANSIEDLUNG') {
    startjahr = max(get(row, 'tpopmassnsByTpopId.nodes', []).map(n => n.jahr))
  }
  // 3 set tpop.ekfrequenzStartjahr
  // 4 return startjahr
}
