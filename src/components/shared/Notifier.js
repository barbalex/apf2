import { useEffect, useContext, useState } from 'react'
import { useSnackbar } from 'notistack'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'

const Notifier = () => {
  const { enqueueSnackbar } = useSnackbar()
  const store = useContext(storeContext)
  const { notifications, removeNotification } = store
  const [displayed, setDisplayed] = useState([])

  useEffect(() => {
    notifications.forEach((notification) => {
      // Do nothing if snackbar is already displayed
      if (displayed.includes(notification.key)) return

      // Display snackbar using notistack
      enqueueSnackbar(notification.message, notification.options)
      // Keep track of snackbars that we've displayed
      setDisplayed([...displayed, notification.key])
      // Dispatch action to remove snackbar from mobx store
      removeNotification(notification.key)
    })
  }, [displayed, enqueueSnackbar, notifications, removeNotification])

  return null
}

export default observer(Notifier)
