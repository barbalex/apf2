// @flow
import React from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import ErrorBoundary from '../shared/ErrorBoundary'
import dataGql from './data.graphql'

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

const Errors = () => (
  <Query query={dataGql} >
    {({ loading, error: loadingError, data }) => {
      if (loadingError) return `Fehler: ${loadingError.message}`

      const errors = get(data, 'errors', [])

      return (
        <ErrorBoundary>
          <Container>
            {errors.map((error, index) => (
              <ErrorDiv key={index}>{error}</ErrorDiv>
            ))}
          </Container>
        </ErrorBoundary>
      )
    }}
  </Query>
)

export default Errors
