// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
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

const enhance = compose(inject('store'), observer)

const Errors = ({ store }: { store: Object }) => (
  <Query query={dataGql} >
    {({ loading, error, data }) => {
      if (error) return `Fehler: ${error.message}`

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

export default enhance(Errors)
