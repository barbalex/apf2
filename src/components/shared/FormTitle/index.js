import React, { useEffect } from 'react'
import styled from 'styled-components'
import { withResizeDetector } from 'react-resize-detector'

import TestdataMessage from './TestdataMessage'

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
  justify-content: space-between;
`
const Title = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  padding: 10px;
  color: white;
  font-weight: bold;
  height: 43px;
`
const Buttons = styled.div`
  display: flex;
  padding: 3px 0 3px 10px;
`

const FormTitle = ({
  title,
  apId,
  treeName,
  buttons,
  height = 43,
  setFormTitleHeight = () => {},
}) => {
  useEffect(() => {
    setFormTitleHeight(height)
  }, [height, setFormTitleHeight])

  if (!treeName) {
    console.log('FormTitle was not passed a treeName, bailing out!')
    return
  }

  return (
    <Container>
      <TitleRow>
        <Title data-id="form-title">{title}</Title>
        <Buttons>{buttons}</Buttons>
      </TitleRow>
      <TestdataMessage treeName={treeName} apId={apId} />
    </Container>
  )
}

export default withResizeDetector(FormTitle)
