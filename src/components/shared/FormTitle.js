// @flow
import React from 'react'
import styled from 'styled-components'
import FilterIcon from '@material-ui/icons/FilterList'
import EditIcon from '@material-ui/icons/Edit'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import TestdataMessage from './TestdataMessage'
import withNodeFilterState from '../../state/withNodeFilter'
import { Icon } from '@material-ui/core'

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
const IconDiv = styled.div``
const StyledFilterIcon = styled(FilterIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
  padding-right: 10px;
  padding-bottom: 0;
  color: white;
  vertical-align: middle;
`
const StyledEditIcon = styled(EditIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
  padding-right: 10px;
  padding-bottom: 0;
  color: white;
  vertical-align: middle;
`

const enhance = compose(
  withNodeFilterState,
  withHandlers({
    onToggleShow: ({ nodeFilterState }) => () => nodeFilterState.toggleShow(),
  }),
)

const FormTitle = ({
  tree,
  title,
  apId,
  nodeFilterState,
  onToggleShow,
}: {
  tree: Object,
  title: String,
  apId: String,
  nodeFilterState: Object,
  onToggleShow: () => void,
}) => (
  <Container>
    <TitleRow>
      <Title>{title}</Title>
      {nodeFilterState.state.show ? (
        <IconDiv title="Daten anzeigen und bearbeiten">
          <StyledEditIcon onClick={onToggleShow} />
        </IconDiv>
      ) : (
        <IconDiv title="Daten filtern (TODO)">
          <StyledFilterIcon onClick={onToggleShow} />
        </IconDiv>
      )}
    </TitleRow>
    <TestdataMessage tree={tree} apId={apId} />
  </Container>
)

export default enhance(FormTitle)
