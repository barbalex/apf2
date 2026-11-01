import { apiFetch } from './api.ts'

import {
  store,
  addNotificationAtom,
  type Notification,
} from '../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const getAndValidateCoordinatesOfBeob = async ({
  id,
}: {
  id: string
}) => {
  let beob: { lv95X: number | null; lv95Y: number | null } | undefined
  try {
    const beobs = await apiFetch<
      { lv95X: number | null; lv95Y: number | null }[]
    >(`/q_beob?id=eq.${id}&select=lv95X:lv95_x,lv95Y:lv95_y`)
    beob = beobs?.[0]
  } catch (error) {
    addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  const lv95X = beob?.lv95X
  const lv95Y = beob?.lv95Y
  if (!lv95X) {
    addNotification({
      message: `Die Beobachtung mit der ID ${id} hat keine (vollständigen) Koordinaten`,
      options: {
        variant: 'error',
      },
    })
    return { lv95X: null, lv95Y: null }
  }
  return { lv95X, lv95Y }
}
