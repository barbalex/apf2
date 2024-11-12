import { memo } from 'react'
import styled from '@emotion/styled'

import { TestdataMessage } from './TestdataMessage.jsx'

const Container = styled.div`
  background-color: #388e3c;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  @media print {
    display: none !important;
  }
`
const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 42px;
  flex-shrink: 0;
`
const Title = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  padding: 10px;
  color: white;
  font-weight: bold;
  /* height: 43px; */
`
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: center;
  padding: 0 0 0 10px;
`

export const FormTitle = memo(
  ({ title, menuBar, noTestDataMessage = false }) => (
    <Container>
      <TitleRow>
        <Title data-id="form-title">{title}</Title>
        <Buttons>{menuBar}</Buttons>
      </TitleRow>
      {!noTestDataMessage && <TestdataMessage />}
    </Container>
  ),
)
