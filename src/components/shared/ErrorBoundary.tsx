import { ErrorBoundary as RawErrorBoundary } from 'react-error-boundary'
import type { FallbackProps } from 'react-error-boundary'
import type { ReactNode } from 'react'
import Button from '@mui/material/Button'

import { logout } from '../../modules/logout.ts'

import styles from './ErrorBoundary.module.css'

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const onReload = () => window.location.reload()

  return (
    <div className={styles.container}>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre className={styles.preWrapping}>{(error as Error)?.message}</pre>
      <details className={styles.details}>
        <summary className={styles.summary}>Mehr Informationen</summary>
        <pre className={styles.pre}>{error ? String(error) : ''}</pre>
      </details>
      <div className={styles.buttonContainer}>
        <Button
          variant="outlined"
          onClick={onReload}
          color="inherit"
          className={styles.button}
        >
          neu starten
        </Button>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          variant="outlined"
          onClick={resetErrorBoundary}
          className={styles.button}
        >
          App-Cache leeren und neu starten (neue Anmeldung nötig)
        </Button>
      </div>
    </div>
  )
}

export const ErrorBoundary = ({ children }: { children: ReactNode }) => (
  <RawErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => void logout()}
  >
    {children}
  </RawErrorBoundary>
)
