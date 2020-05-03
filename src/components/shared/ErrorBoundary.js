import React, { useCallback } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'

import logout from '../../modules/logout'

const Container = styled.div`
  padding: 15px;
`
const ButtonContainer = styled.div`
  margin-right: 10px;
  margin-bottom: 10px;
`
const StyledButton = styled(Button)`
  text-transform: none !important;
`

const ErrorFallback = ({ error, componentStack, resetErrorBoundary }) => {
  const onReload = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.reload(true)
    }
  }, [])

  return (
    <Container>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <pre>{error.message}</pre>
      {/*<pre>{componentStack}</pre>*/}
      <ButtonContainer>
        <StyledButton variant="outlined" onClick={onReload}>
          neu starten
        </StyledButton>
      </ButtonContainer>
      <ButtonContainer>
        <StyledButton variant="outlined" onClick={resetErrorBoundary}>
          Cache leeren und neu starten (neue Anmeldung nötig)
        </StyledButton>
      </ButtonContainer>
    </Container>
  )
}

const MyErrorBoundary = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onReset={logout}>
    {children}
  </ErrorBoundary>
)

export default MyErrorBoundary
