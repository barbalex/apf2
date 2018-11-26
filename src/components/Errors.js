// @flow
import React, { useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from './shared/ErrorBoundary'
import mobxStoreContext from '../mobxStoreContext'

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

const Errors = () => {
  const { errors } = useContext(mobxStoreContext)

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
