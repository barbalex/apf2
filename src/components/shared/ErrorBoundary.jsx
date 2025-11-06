import { useContext } from 'react'
import { ErrorBoundary as RawErrorBoundary } from 'react-error-boundary'
import Button from '@mui/material/Button'

import { logout } from '../../modules/logout.js'
import { IdbContext } from '../../idbContext.js'

import {
  container,
  buttonContainer,
  button,
  details,
  summary,
  preWrapping,
  pre,
} from './ErrorBoundary.module.css'

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const onReload = () => window.location.reload(true)

  return (
    <div className={container}>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre className={preWrapping}>{error.message}</pre>
      <details className={details}>
        <summary className={summary}>Mehr Informationen</summary>
        <pre className={pre}>{error?.message ?? error}</pre>
      </details>
      <div className={buttonContainer}>
        <Button
          variant="outlined"
          onClick={onReload}
          color="inherit"
          className={button}
        >
          neu starten
        </Button>
      </div>
      <div className={buttonContainer}>
        <Button
          variant="outlined"
          onClick={resetErrorBoundary}
          className={button}
        >
          Cache leeren und neu starten (neue Anmeldung nötig)
        </Button>
      </div>
    </div>
  )
}

export const ErrorBoundary = ({ children }) => {
  const { idb } = useContext(IdbContext)
  const onLogout = () => logout(idb)

  return (
    <RawErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onLogout}
    >
      {children}
    </RawErrorBoundary>
  )
}
