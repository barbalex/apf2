import { rpc } from './api.ts'
import {
  store,
  addNotificationAtom,
  type Notification,
} from '../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const historizeForAp = async ({
  year,
  apId,
}: {
  year: number
  apId: string
}) => {
  try {
    await rpc('historize_for_ap', { _year: year, ap_id: apId })
  } catch (error) {
    console.log('Error from mutating historize:', error)
    return addNotification({
      message: `Die Historisierung ist gescheitert. Fehlermeldung: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }

  // notify user
  addNotification({
    message: `Art, Pop und TPop wurden für das Jahr ${year} historisiert`,
    options: {
      variant: 'success',
    },
  })

  return
}
