import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'

import styles from './SpinnerOverlay.module.css'

export const SpinnerOverlay = ({ message, onClose }) => (
  <Dialog
    open
    onClose={onClose}
    disableEscapeKeyDown={true}
  >
    <div className={styles.container}>
      <CircularProgress />
      {!!message && <div className={styles.text}>{message}</div>}
    </div>
  </Dialog>
)
