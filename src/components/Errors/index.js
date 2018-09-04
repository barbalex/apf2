// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'

import ErrorBoundary from '../shared/ErrorBoundary'
import withErrorState from '../../state/withErrorState'

const Container = styled.div`
  position: absolute;
  left: 5px;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  max-width: 300px;
  z-index: 2000;
`
const ErrorDiv = styled.div`
  padding: 10px 10px;
  margin: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #424242;
  color: white;
  max-width: 300px;
  font-size: 14px;
`

const enhance = compose(withErrorState)

const Errors = ({ errorState }: { errorState: Object }) => (
  <ErrorBoundary>
    <Container>
      {errorState.state.errors.map((error, index) => (
        <ErrorDiv key={index}>{error.message}</ErrorDiv>
      ))}
    </Container>
  </ErrorBoundary>
)

export default enhance(Errors)
