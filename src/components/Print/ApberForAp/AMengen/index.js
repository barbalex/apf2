// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import { Query } from 'react-apollo'

import dataGql from './data.graphql'

const Container = styled.div`
  padding: 0.2cm 0;
`
const Title = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
  font-weight: 600;
`
const Row = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
`

const AMengen = ({
  apberId,
}:{
  apberId: String,
}) =>
  <Query
    query={dataGql}
    variables={{ apberId }}
  >
    {({ loading, error, data: data1 }) => {
      if (error) return `Fehler: ${error.message}`

      return (
        <Container>
        </Container>
      )
    }}
  </Query>
  

export default AMengen
