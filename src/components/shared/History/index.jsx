import { memo } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import { Data } from './Data.jsx'
import { ErrorBoundary } from '../ErrorBoundary.jsx'

const Container = styled.div`
  padding: 10px 0;
`
const Title = styled.h4`
  margin-bottom: 0;
`
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const History = memo(
  observer(({ year, dataArray }) => (
    <ErrorBoundary>
      <Container>
        <TitleRow>
          <Title>{year}</Title>
        </TitleRow>
        <Data dataArray={dataArray} />
      </Container>
    </ErrorBoundary>
  )),
)
