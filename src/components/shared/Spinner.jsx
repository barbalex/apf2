import React from 'react'
import styled from '@emotion/styled'
import CircularProgress from '@mui/material/CircularProgress'

const SpinnerContainer = styled.div`
  min-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const SpinnerText = styled.div`
  padding: 10px;
`

const SpinnerComponent = ({ message }) => (
  <SpinnerContainer>
    <CircularProgress />
    {!!message && <SpinnerText>{message}</SpinnerText>}
  </SpinnerContainer>
)

export default SpinnerComponent
