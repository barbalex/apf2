import React, { useCallback, useContext } from 'react'
import { ErrorBoundary as RawErrorBoundary } from 'react-error-boundary'
import styled from '@emotion/styled'
import Button from '@mui/material/Button'

import { logout } from '../../modules/logout.js'
import { IdbContext } from '../../idbContext.js'

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

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const onReload = useCallback(() => window.location.reload(true), [])

  return (
    <Container>
      <p>Sorry, ein Fehler ist aufgetreten:</p>
      <PreWrapping>{error.message}</PreWrapping>
      <Details>
        <Summary>Mehr Informationen</Summary>
        <Pre>{error?.message ?? error}</Pre>
      </Details>
      <ButtonContainer>
        <StyledButton
          variant="outlined"
          onClick={onReload}
          color="inherit"
        >
          neu starten
        </StyledButton>
      </ButtonContainer>
      <ButtonContainer>
        <StyledButton
          variant="outlined"
          onClick={resetErrorBoundary}
        >
          Cache leeren und neu starten (neue Anmeldung nötig)
        </StyledButton>
      </ButtonContainer>
    </Container>
  )
}

export const ErrorBoundary = ({ children }) => {
  const { idb } = useContext(IdbContext)
  const onLogout = useCallback(() => logout(idb), [idb])

  return (
    <RawErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onLogout}
    >
      {children}
    </RawErrorBoundary>
  )
}
