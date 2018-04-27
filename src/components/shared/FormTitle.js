// @flow
import React from 'react'
import styled from 'styled-components'

import TestdataMessage from './TestdataMessage'

const Container = styled.div`
  background-color: #388e3c;
  padding-bottom: 10px;
  flex-shrink: 0;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: white;
  font-weight: bold;
`

const FormTitle = ({
  tree,
  title,
  apId,
}: {
  tree: Object,
  title: String,
  apId: String,
}) => (
  <Container>
    <Title>{title}</Title>
    <TestdataMessage tree={tree} apId={apId} />
  </Container>
)

export default FormTitle
