import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'

import { container, text } from './SpinnerOverlay.module.css'

export const SpinnerOverlay = ({ message, onClose }) => (
  <Dialog
    open
    onClose={onClose}
    disableEscapeKeyDown={true}
  >
    <div className={container}>
      <CircularProgress />
      {!!message && <div className={text}>{message}</div>}
    </div>
  </Dialog>
)
