import { useEffect } from 'react'
import { useRouteError } from 'react-router'
import Button from '@mui/material/Button'

import { logout } from '../../modules/logout.ts'
import { reportError } from '../../modules/errorTelemetry.ts'

import styles from './RouterErrorBoundary.module.css'

// how a failed dynamic import surfaces when a stale client (open tab
// across a deploy) requests a hashed chunk that no longer exists —
// wording differs per browser
const moduleLoadFailed = (message: string | undefined) =>
  !!message &&
  (message.includes('dynamically imported module') ||
    message.includes('Importing a module script failed'))

export const RouterErrorBoundary = () => {
  const error = useRouteError()

  useEffect(() => {
    void reportError('boundary', error)
  }, [error])

  const errorMessage = (error as Error)?.message ?? String(error)
  const staleClient = moduleLoadFailed(errorMessage)

  const onReload = () => window.location.reload()

  return (
    <div className={styles.container}>
      {staleClient ? (
        <p>
          Die App wurde aktualisiert und diese Sitzung ist veraltet. Bitte
          neu starten (falls das nicht hilft, App-Cache leeren):
        </p>
      ) : (
        <>
          <p>Sorry, ein Fehler ist aufgetreten:</p>
          <pre className={styles.preWrapping}>{errorMessage}</pre>
        </>
      )}
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
          onClick={() => void logout()}
          color="inherit"
        >
          App-Cache leeren und neu starten (neue Anmeldung nötig)
        </Button>
      </div>
    </div>
  )
}
