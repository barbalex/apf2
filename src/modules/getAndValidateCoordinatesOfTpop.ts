import { apiFetch } from './api.ts'

import {
  store,
  addNotificationAtom,
  type Notification,
} from '../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const getAndValidateCoordinatesOfTpop = async ({
  id,
}: {
  id: string
}) => {
  let tpop: { lv95X: number | null; lv95Y: number | null } | undefined
  try {
    const tpops = await apiFetch<
      { lv95X: number | null; lv95Y: number | null }[]
    >(`/q_tpop?id=eq.${id}&select=lv95X:lv95_x,lv95Y:lv95_y`)
    tpop = tpops?.[0]
  } catch (error) {
    addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const { lv95X, lv95Y } = tpop ?? {}
  if (!lv95X) {
    addNotification({
      message: `Die Teilpopulation mit der ID ${id} hat keine (vollständigen) Koordinaten`,
      options: {
        variant: 'warning',
      },
    })
    return { lv95X: null, lv95Y: null }
  }
  return { lv95X, lv95Y }
}
