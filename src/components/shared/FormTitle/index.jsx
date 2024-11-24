import { memo } from 'react'
import styled from '@emotion/styled'

import { TestdataMessage } from './TestdataMessage.jsx'

const Container = styled.div`
  background-color: #388e3c;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media print {
    display: none !important;
  }
`
const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 42px;
  flew-wrap: nowrap;
  overflow: hidden;
`
const Title = styled.div`
  display: block;
  flex-grow: 0;
  flex-shrink: 1;
  margin-top: auto;
  margin-bottom: auto;
  padding: 10px;
  color: white;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const FormTitle = memo(
  ({ title, menuBar, noTestDataMessage = false }) => (
    <Container>
      <TitleRow>
        <Title data-id="form-title">{title}</Title>
        {menuBar}
      </TitleRow>
      {!noTestDataMessage && <TestdataMessage />}
    </Container>
  ),
)
