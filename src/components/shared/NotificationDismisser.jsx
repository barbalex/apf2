import { useCallback, memo } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MdClose as CloseIcon } from 'react-icons/md'
import { useSnackbar } from 'notistack'

export const NotificationDismisser = memo(({ nKey }) => {
  const { closeSnackbar } = useSnackbar()
  const onClick = useCallback(() => closeSnackbar(nKey), [closeSnackbar, nKey])

  return (
    <Tooltip
      title="Schliessen"
      key="closeNotificationDismisser"
    >
      <IconButton
        key="close"
        aria-label="Close"
        color="inherit"
        onClick={onClick}
        size="large"
      >
        <CloseIcon />
      </IconButton>
    </Tooltip>
  )
})
