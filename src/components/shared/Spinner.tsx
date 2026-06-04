import CircularProgress from '@mui/material/CircularProgress'

import styles from './Spinner.module.css'

export const Spinner = ({ message }) => (
  <div className={styles.container}>
    <CircularProgress />
    {!!message && <div className={styles.text}>{message}</div>}
  </div>
)
