import React, { useCallback, useContext } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'
import Button from '@mui/material/Button'

import logout from '../../modules/logout'
import idbContext from '../../idbContext'

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
const Details = styled.details`
  margin-bottom: 25px;
`
const Summary = styled.summary`
  user-select: none;
  &:focus {
    outline: none !important;
  }
`
const PreWrapping = styled.pre`
  white-space: normal;
`
const Pre = styled.pre`
  background-color: rgba(128, 128, 128, 0.09);
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
      <PreWrapping>{error.message}</PreWrapping>
      <Details>
        <Summary>Mehr Informationen</Summary>
        <Pre>{componentStack}</Pre>
      </Details>
      <ButtonContainer>
        <StyledButton variant="outlined" onClick={onReload} color="inherit">
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

const MyErrorBoundary = ({ children }) => {
  const { idb } = useContext(idbContext)
  const onLogout = useCallback(() => logout(idb), [idb])

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={onLogout}>
      {children}
    </ErrorBoundary>
  )
}

export default MyErrorBoundary
