import type { TpopRow } from '../tableTypes.ts'
import { apiFetch, apiUpdate } from '../../../../modules/api.ts'
import {
  store,
  addNotificationAtom,
  userNameAtom,
  type Notification,
} from '../../../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const setStartjahr = async ({
  row,
  ekfrequenz,
}: {
  row: TpopRow
  ekfrequenz: string | null
}) => {
  if (!ekfrequenz) return
  // 1  get ekfrequenz's kontrolljahreAb
  let ekfrequenzValues:
    | { kontrolljahre: number[] | null; kontrolljahreAb: string | null }
    | undefined
  try {
    ekfrequenzValues = ((await apiFetch<
      { kontrolljahre: number[] | null; kontrolljahreAb: string | null }[]
    >(
      `/ekfrequenz?id=eq.${ekfrequenz}&select=kontrolljahre,kontrolljahreAb:kontrolljahre_ab`,
    )) ?? [])[0]
  } catch (error) {
    return addNotification({
      message: `Fehler beim Abfragen der EK-Frequenz: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }
  // return if no kontrolljahre exist
  // it makes no sense to set startjahr if there are no kontrolljahre
  // see: https://github.com/barbalex/apf2/issues/401
  const kontrolljahre = ekfrequenzValues?.kontrolljahre ?? []

  if (kontrolljahre.length === 0) return
  // so there exist kontrolljahre
  // now set startjahr
  const kontrolljahreAb = ekfrequenzValues?.kontrolljahreAb ?? null
  if (!kontrolljahreAb) {
    return addNotification({
      message: `Bei der gewählten EK-Frequenz wurde das Feld 'Kontrolljahre ab' nicht erfasst. Daher konnte das Startjahr nicht berechnet werden`,
      options: {
        variant: 'error',
      },
    })
  }
  let ekfrequenzStartjahr: number | undefined
  // 2a if ek: get last ek
  if (kontrolljahreAb === 'ek') {
    let kontrollen: { jahr: number }[]
    try {
      kontrollen =
        (await apiFetch<{ jahr: number }[]>(
          `/tpopkontr?tpop_id=eq.${row.id}&select=jahr`,
        )) ?? []
    } catch (error) {
      return addNotification({
        message: `Fehler beim Abfragen der EK-Kontrollen: ${(error as Error).message}`,
        options: {
          variant: 'error',
        },
      })
    }
    // ISSUE: if no kontrollen exist, ekfrequenzStartjahr becomes -Infinity
    // so we need to check for that case and set startjahr to null in case a value was set previously (should not happen outside text data?)
    if (!kontrollen.length) {
      addNotification({
        message: `Offenbar gibt es keine Kontrolle. Daher wird das aktuelle Jahr als Startjahr gesetzt`,
        options: {
          variant: 'info',
        },
      })
    }
    ekfrequenzStartjahr =
      kontrollen.length ?
        Math.max(...kontrollen.map((n) => n.jahr))
      : new Date().getFullYear()
  }
  // 2b if ansiedlung: get last ansiedlung
  if (kontrolljahreAb === 'ansiedlung') {
    // TODO:
    // if tpop.status === 201 (Ansaatversuch): choose first ansaat
    // else: choose last anpflanzung
    let massnahmen: { jahr: number }[]
    try {
      massnahmen =
        (await apiFetch<{ jahr: number }[]>(
          `/tpopmassn?tpop_id=eq.${row.id}&select=jahr`,
        )) ?? []
    } catch (error) {
      return addNotification({
        message: `Fehler beim Abfragen der EK-Kontrollen: ${(error as Error).message}`,
        options: {
          variant: 'error',
        },
      })
    }
    ekfrequenzStartjahr = Math.max(...massnahmen.map((n) => n.jahr))
    if (!ekfrequenzStartjahr) {
      return addNotification({
        message: `Offenbar gibt es keine Ansiedlung. Daher kann das EK-Frequenz-Startjahr nicht gesetzt werden`,
        options: {
          variant: 'info',
        },
      })
    }
  }
  // 3 set tpop.ekfrequenzStartjahr
  try {
    await apiUpdate('tpop', row.id, {
      ekfrequenz_startjahr: ekfrequenzStartjahr,
      changed_by: store.get(userNameAtom),
    })
  } catch (error) {
    return addNotification({
      message: `Fehler beim Aktualisieren der Teil-Population: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }
  return
}
