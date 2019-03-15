// @flow
import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import TestdataMessage from './TestdataMessage'

const Container = styled.div`
  background-color: #388e3c;
  padding-bottom: 10px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  @media print {
    display: none !important;
  }
`
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
`
const Title = styled.div`
  padding: 10px 10px 0 10px;
  color: white;
  font-weight: bold;
`

const FormTitle = ({
  title,
  apId,
  treeName,
}: {
  title: string,
  apId: string,
  treeName: string,
}) => {
  return (
    <Container>
      <TitleRow>
        <Title data-id="form-title">{title}</Title>
      </TitleRow>
      <TestdataMessage treeName={treeName} apId={apId} />
    </Container>
  )
}

export default observer(FormTitle)
