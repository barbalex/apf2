// @flow
import React from 'react'
import styled from 'styled-components'
import FilterIcon from '@material-ui/icons/FilterList'
import ListIcon from '@material-ui/icons/List'
import compose from 'recompose/compose'

import TestdataMessage from './TestdataMessage'
import withNodeFilterState from '../../state/withNodeFilter'

const Container = styled.div`
  background-color: #388e3c;
  padding-bottom: 10px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
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
const StyledFilterIcon = styled(FilterIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding: 10px;
  padding-bottom: 0;
  color: white;
`
const StyledListIcon = styled(ListIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding: 10px;
  padding-bottom: 0;
  color: white;
`

const enhance = compose(withNodeFilterState)

const FormTitle = ({
  tree,
  title,
  apId,
  nodeFilterState,
}: {
  tree: Object,
  title: String,
  apId: String,
  nodeFilterState: Object,
}) => (
  <Container>
    <TitleRow>
      <Title>{title}</Title>
      {nodeFilterState.show ? (
        <StyledListIcon onClick={nodeFilterState.toggleShow} />
      ) : (
        <StyledFilterIcon onClick={nodeFilterState.toggleShow} />
      )}
    </TitleRow>
    <TestdataMessage tree={tree} apId={apId} />
  </Container>
)

export default enhance(FormTitle)
