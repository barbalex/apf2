import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  notificationsAtom,
  removeNotificationAtom,
} from '../../store/index.ts'

export const Notifier = () => {
  const { enqueueSnackbar } = useSnackbar()
  const notifications = useAtomValue(notificationsAtom)
  const removeNotification = useSetAtom(removeNotificationAtom)
  const [displayed, setDisplayed] = useState([])

  useEffect(() => {
    notifications.forEach((notification) => {
      // Do nothing if snackbar is already displayed
      if (displayed.includes(notification.key)) return

      // Display snackbar using notistack
      enqueueSnackbar(notification.message, notification.options)
      // Keep track of snackbars that we've displayed
      setDisplayed([...displayed, notification.key])
      // Dispatch action to remove snackbar from jotai store
      removeNotification(notification.key)
    })
  }, [displayed, enqueueSnackbar, notifications, removeNotification])

  return null
}
