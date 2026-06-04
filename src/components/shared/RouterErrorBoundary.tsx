import { useRouteError } from 'react-router'
import Button from '@mui/material/Button'

import { logout } from '../../modules/logout.ts'

import styles from './RouterErrorBoundary.module.css'

export const RouterErrorBoundary = ({ children }) => {
  const error = useRouteError()

  const onReload = () => window.location.reload(true)

  return (
    <div className={styles.container}>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre className={styles.preWrapping}>{error.message}</pre>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          variant="outlined"
          onClick={onReload}
          color="inherit"
        >
          neu starten
        </Button>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          variant="outlined"
          onClick={logout}
          color="inherit"
        >
          Cache leeren und neu starten (neue Anmeldung nötig)
        </Button>
      </div>
    </div>
  )
}
