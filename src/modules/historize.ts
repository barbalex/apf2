import { DateTime } from 'luxon'

import { rpc, apiUpdate } from './api.ts'
import {
  store,
  addNotificationAtom,
  type Notification,
} from '../store/index.ts'

const addNotification = (notification: Omit<Notification, 'key'>) =>
  store.set(addNotificationAtom, notification)

export const historize = async ({
  apberuebersicht: row,
}: {
  apberuebersicht: Record<string, unknown> & { id: string }
}) => {
  // 1. historize
  try {
    await rpc('historize', { _year: row?.jahr as number })
  } catch (error) {
    console.log('Error from mutating historize:', error)
    return addNotification({
      message: `Die Historisierung ist gescheitert. Fehlermeldung: ${(error as Error).message}`,
      options: {
        variant: 'error',
      },
    })
  }
  // 2. if it worked: mutate historyDate
  try {
    await apiUpdate(
      'apberuebersicht',
      row?.id,
      { history_date: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd') },
    )
  } catch (error) {
    return addNotification({
      message: (error as Error).message,
      options: {
        variant: 'error',
      },
    })
  }
  // notify user
  addNotification({
    message: `Arten, Pop und TPop wurden für das Jahr ${row?.jahr} historisiert`,
    options: {
      variant: 'success',
    },
  })
  return
}
