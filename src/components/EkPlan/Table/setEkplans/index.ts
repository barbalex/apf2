import { apiFetch, apiInsert } from '../../../../modules/api.ts'
import {
  store,
  addNotificationAtom,
  type Notification,
} from '../../../../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const setEkplans = async ({
  tpopId,
  ekfrequenz: ekfrequenzValue,
  ekfrequenzStartjahr,
}: {
  tpopId: string
  ekfrequenz: string | null
  ekfrequenzStartjahr: number | null
}) => {
  if (!ekfrequenzStartjahr) return
  if (!ekfrequenzValue) return
  // 1. query all ekplans beginning with ekfrequenzStartjahr
  let ekplanIds: string[]
  try {
    ekplanIds = (
      (await apiFetch<{ id: string }[]>(
        `/ekplan?tpop_id=eq.${tpopId}&jahr=gte.${ekfrequenzStartjahr}&select=id`,
      )) ?? []
    ).map((e) => e.id)
  } catch (error) {
    return addNotification({
      message: `Fehler beim Abfragen der bisherigen EK-Pläne: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }
  // 2. delete them
  if (ekplanIds.length) {
    try {
      await apiFetch(`/ekplan?id=in.(${ekplanIds.join(',')})`, {
        method: 'DELETE',
      })
    } catch (error) {
      return addNotification({
        message: `Fehler beim Löschen der bisherigen EK-Pläne: ${(error as Error).message}`,
        options: {
          variant: 'error',
        },
      })
    }
  }
  // 3. fetch ekfrequenz.kontrolljahre for this tpop.ekfrequenz
  let ekfrequenz: { ektyp: string; kontrolljahre: number[] | null } | undefined
  try {
    ekfrequenz = ((await apiFetch<
      { ektyp: string; kontrolljahre: number[] | null }[]
    >(
      `/ekfrequenz?id=eq.${ekfrequenzValue}&ektyp=not.is.null&select=ektyp,kontrolljahre`,
    )) ?? [])[0]
  } catch (error) {
    return addNotification({
      message: `Fehler beim Abfragen der Kontrolljahre: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }
  if (!ekfrequenz) return
  // 4. add kontrolljahre to ekplan
  // ek_type enum labels are lowercase (PostgREST returns labels,
  // graphql used to return uppercased values)
  const typ = ekfrequenz.ektyp
  const kontrolljahre: number[] = ekfrequenz.kontrolljahre || []
  if (kontrolljahre.length === 0) {
    return addNotification({
      message: `Ab ${ekfrequenzStartjahr} wurden die bestehenden EK-Pläne gelöscht. Weil aber für die gewählte EK-Frequenz keine Kontrolljahre existieren, wurden keine neuen Kontrolljahre gesetzt`,
      options: {
        variant: 'info',
      },
    })
  }
  try {
    await apiInsert(
      'ekplan',
      kontrolljahre.map((jahr: number) => ({
        tpop_id: tpopId,
        jahr: jahr + ekfrequenzStartjahr,
        typ,
      })),
    )
  } catch (error) {
    return addNotification({
      message: `Fehler beim Schaffen neuer EK-Pläne: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }
  // 5. tell user how it went
  return
}
