import React, { useCallback } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'

import logout from '../../modules/logout'

const Container = styled.div`
  padding: 15px;
`
const StyledButton = styled(Button)`
  text-transform: none !important;
  margin-right: 10px;
`

const ErrorFallback = ({ error, componentStack, resetErrorBoundary }) => {
  const onReload = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.reload(true)
    }
  }, [])

  return (
    <Container>
      <p>Etwas ist schief gelaufen. Fehler-Meldung:</p>
      <pre>{error.message}</pre>
      {/*<pre>{componentStack}</pre>*/}
      <StyledButton variant="outlined" onClick={onReload}>
        neu starten
      </StyledButton>
      <StyledButton variant="outlined" onClick={resetErrorBoundary}>
        Cache löschen und neu starten
      </StyledButton>
    </Container>
  )
}

const MyErrorBoundary = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onReset={logout}>
    {children}
  </ErrorBoundary>
)

export default MyErrorBoundary
