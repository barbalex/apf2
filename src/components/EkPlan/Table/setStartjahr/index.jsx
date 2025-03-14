import max from 'lodash/max'

import { queryEkfrequenz } from './queryEkfrequenz.js'
import { queryTpopkontr } from './queryTpopkontr.js'
import { queryTpopmassn } from './queryTpopmassn.js'
import { mutationUpdateTpop } from './mutationUpdateTpop.js'

export const setStartjahr = async ({ row, ekfrequenz, client, store }) => {
  const { enqueNotification } = store

  // 1  get ekfrequenz's kontrolljahreAb
  let ekfrequenzResult
  try {
    ekfrequenzResult = await client.query({
      query: queryEkfrequenz,
      variables: { id: ekfrequenz },
    })
  } catch (error) {
    return enqueNotification({
      message: `Fehler beim Abfragen der EK-Frequenz: ${error.message}`,
      options: {
        variant: 'error',
      },
    })
  }
  // return if no kontrolljahre exist
  // it makes no sense to set startjahr if there are no kontrolljahre
  // see: https://github.com/barbalex/apf2/issues/401
  const kontrolljahre =
    ekfrequenzResult?.data?.ekfrequenzById?.kontrolljahre ?? []

  if (kontrolljahre.length === 0) return
  // so there exist kontrolljahre
  // now set startjahr
  const kontrolljahreAb =
    ekfrequenzResult?.data?.ekfrequenzById?.kontrolljahreAb ?? null
  if (!kontrolljahreAb) {
    return enqueNotification({
      message: `Bei der gewählten EK-Frequenz wurde das Feld 'Kontrolljahre ab' nicht erfasst. Daher konnte das Startjahr nicht berechnet werden`,
      options: {
        variant: 'error',
      },
    })
  }
  // TODO: query last ek here instead of fetching from previously loaded
  // reason: no need to load that data beforehand if it is not needed
  let ekfrequenzStartjahr
  // 2a if ek: get last ek
  if (kontrolljahreAb === 'EK') {
    let result
    try {
      result = await client.query({
        query: queryTpopkontr,
        variables: { tpopId: row.id },
      })
    } catch (error) {
      return enqueNotification({
        message: `Fehler beim Abfragen der EK-Kontrollen: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }
    ekfrequenzStartjahr = max(
      (result?.data?.tpopById?.tpopkontrsByTpopId?.nodes ?? []).map(
        (n) => n.jahr,
      ),
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
    // TODO:
    // if tpop.status === 201 (Ansaatversuch): choose first ansaat
    // else: choose last anpflanzung
    let result
    try {
      result = await client.query({
        query: queryTpopmassn,
        variables: { tpopId: row.id },
      })
    } catch (error) {
      return enqueNotification({
        message: `Fehler beim Abfragen der EK-Kontrollen: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }
    ekfrequenzStartjahr = max(
      (result?.data?.tpopById?.tpopmassnsByTpopId?.nodes ?? []).map(
        (n) => n.jahr,
      ),
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
  // const message =
  //   kontrolljahreAb === 'EK' ?
  //     `Entsprechend der letzten Kontrolle wird als EK-Frequenz-Startjahr ${ekfrequenzStartjahr} gesetzt`
  //   : `Entsprechend der letzten Ansiedlung wird als EK-Frequenz-Startjahr ${ekfrequenzStartjahr} gesetzt`
  // enqueNotification({
  //   message,
  //   options: {
  //     variant: 'success',
  //   },
  // })

  // 5 return startjahr
  return ekfrequenzStartjahr
}
