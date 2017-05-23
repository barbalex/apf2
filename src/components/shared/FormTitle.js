// @flow
import React from 'react'
import styled from 'styled-components'

import TestdataMessage from './TestdataMessage'

const Container = styled.div`
  background-color: #388E3C;
  padding-bottom: 10px;
  flex-shrink: 0;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: white;
  font-weight: bold;
`

const FormTitle = ({ tree, title }: { tree: Object, title: string }) => (
  <Container>
    <Title>
      {title}
    </Title>
    <TestdataMessage tree={tree} />
  </Container>
)

export default FormTitle
