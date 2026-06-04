import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'

import styles from './SpinnerOverlay.module.css'

export const SpinnerOverlay = ({ message, onClose }) => (
  <Dialog
    open
    onClose={(event, reason) => {
      if (reason !== 'escapeKeyDown') onClose?.(event, reason)
    }}
  >
    <div className={styles.container}>
      <CircularProgress />
      {!!message && <div className={styles.text}>{message}</div>}
    </div>
  </Dialog>
)
