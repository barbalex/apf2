import React, { useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import { MdClose as CloseIcon } from 'react-icons/md'
import { useSnackbar } from 'notistack'

const NotificationDismisser = ({ nKey }) => {
  const { closeSnackbar } = useSnackbar()
  const onClick = useCallback(() => closeSnackbar(nKey), [closeSnackbar, nKey])

  return (
    <IconButton
      key="close"
      aria-label="Close"
      color="inherit"
      onClick={onClick}
      size="large">
      <CloseIcon />
    </IconButton>
  );
}

export default NotificationDismisser
