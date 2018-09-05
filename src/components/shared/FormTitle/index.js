// @flow
import React from 'react'
import styled from 'styled-components'
import FilterIcon from '@material-ui/icons/FilterList'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import isUuid from 'is-uuid'
import app from 'ampersand-app'

import TestdataMessage from './TestdataMessage'
import withNodeFilterState from '../../../state/withNodeFilter'
import setTreeKeyGql from './setTreeKey.graphql'

const Container = styled.div`
  background-color: ${props => (props.showfilter ? '#D84315' : '#388e3c')};
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
const StyledIconButton = styled(IconButton)`
  height: 30px !important;
  width: 30px !important;
  margin-right: 5px !important;
`
const StyledFilterIcon = styled(FilterIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
  color: white;
`
const StyledEditIcon = styled(EditIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
  color: white;
`

const enhance = compose(
  withNodeFilterState,
  withHandlers({
    onToggleShow: ({ nodeFilterState, activeNodeArray, treeName }) => () => {
      nodeFilterState.toggleShow()
      // if active node is id, pop
      // check if last element of activeNodeArray is uuid
      if (
        activeNodeArray &&
        treeName &&
        isUuid.anyNonNil(activeNodeArray[activeNodeArray.length - 1])
      ) {
        const newActiveNodeArray = activeNodeArray.slice(0, -1)
        app.client.mutate({
          mutation: setTreeKeyGql,
          variables: {
            value: newActiveNodeArray,
            tree: treeName,
            key: 'activeNodeArray',
          },
        })
      }
    },
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
}) => {
  const showFilter = nodeFilterState.state.show
  return (
    <Container showfilter={showFilter}>
      <TitleRow>
        <Title>{`${title}${showFilter ? ' Filterkriterien' : ''}`}</Title>
        {showFilter ? (
          <StyledIconButton
            aria-label="Daten anzeigen und bearbeiten"
            title="Daten anzeigen und bearbeiten"
          >
            <StyledEditIcon onClick={onToggleShow} />
          </StyledIconButton>
        ) : (
          <StyledIconButton
            aria-label="Daten filtern (TODO)"
            title="Daten filtern (TODO)"
          >
            <StyledFilterIcon onClick={onToggleShow} />
          </StyledIconButton>
        )}
      </TitleRow>
      <TestdataMessage tree={tree} apId={apId} />
    </Container>
  )
}

export default enhance(FormTitle)
