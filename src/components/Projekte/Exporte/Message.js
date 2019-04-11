import React from 'react'
import styled from 'styled-components'

import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  position: absolute;
  right: 5px;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  max-width: 700px;
`
const ErrorDiv = styled.div`
  padding: 10px 10px;
  margin: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #424242;
  color: white;
  max-width: 700px;
  font-size: 14px;
`

const DownloadMessage = ({ message }) => (
  <ErrorBoundary>
    <Container>
      <ErrorDiv>{message}</ErrorDiv>
    </Container>
  </ErrorBoundary>
)

export default DownloadMessage
