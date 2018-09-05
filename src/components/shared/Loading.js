// @flow
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 10px;
`

const LoadingComponent = ({ isLoading, loading, error }) => {
  if (isLoading || loading) {
    return <Container>Lade...</Container>
  } else if (error) {
    // uncomment following when researching errors
    // throw error
    return (
      <Container>
        {`Entschuldigung, die Seite konnte nicht geladen werden. Fehler: ${
          error.message
        }`}
      </Container>
    )
  } else {
    return null
  }
}

export default LoadingComponent
