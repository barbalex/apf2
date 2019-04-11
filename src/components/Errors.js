import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from './shared/ErrorBoundary'
import storeContext from '../storeContext'

const Container = styled.div`
  position: absolute;
  left: 5px;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  z-index: 2000;
  min-width: 300px;
  /*min-height: 100px;*/
`
const ErrorDiv = styled.div`
  padding: 10px 10px;
  margin: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #424242;
  color: white;
  max-width: 500px;
  font-size: 14px;
`

const Errors = () => {
  const store = useContext(storeContext)
  const { errors } = store

  return (
    <ErrorBoundary>
      <Container>
        {errors.map((error, index) => (
          <ErrorDiv key={index}>{error.message}</ErrorDiv>
        ))}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(Errors)
