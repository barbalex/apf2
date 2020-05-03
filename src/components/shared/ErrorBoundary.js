import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import logout from '../../modules/logout'

function ErrorFallback({ error, componentStack, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Etwas ist schief gelaufen:</p>
      <pre>{error.message}</pre>
      <pre>{componentStack}</pre>
      <button onClick={resetErrorBoundary}>
        Cache löschen und neu starten
      </button>
    </div>
  )
}

const MyErrorBoundary = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onReset={logout}>
    {children}
  </ErrorBoundary>
)

export default MyErrorBoundary
