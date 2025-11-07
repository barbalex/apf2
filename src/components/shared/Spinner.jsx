import CircularProgress from '@mui/material/CircularProgress'

import { container, text } from './Spinner.module.css'

export const Spinner = ({ message }) => (
  <div className={container}>
    <CircularProgress />
    {!!message && <div className={text}>{message}</div>}
  </div>
)
