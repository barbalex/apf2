import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import Data from './Data'
import ErrorBoundary from '../ErrorBoundary'

const Container = styled.div`
  padding: 10px;
`
const Title = styled.h4`
  margin-bottom: 0;
`
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

const History = ({ year, dataArray }) => (
  <ErrorBoundary>
    <Container>
      <TitleRow>
        <Title>{year}</Title>
      </TitleRow>
      <Data dataArray={dataArray} />
    </Container>
  </ErrorBoundary>
)

export default observer(History)
