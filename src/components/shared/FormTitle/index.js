// @flow
import React from 'react'
import styled from 'styled-components'
import FilterIcon from '@material-ui/icons/FilterList'
import DeleteFilterIcon from '@material-ui/icons/DeleteSweep'
import DeleteFilterIcon2 from '@material-ui/icons/DeleteSweepOutlined'
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
const Symbols = styled.div`
  display: flex;
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
  table,
  treeName,
}: {
  tree: Object,
  title: string,
  apId: string,
  nodeFilterState: Object,
  onToggleShow: () => void,
  table: string,
  treeName: string,
}) => {
  const showFilter = nodeFilterState.state.show
  let existsTableFilter
  let existsTreeFilter
  const doFilter = table && treeName
  if (doFilter) {
    existsTableFilter = nodeFilterState.tableIsFiltered({
      treeName,
      table,
    })
    existsTreeFilter = nodeFilterState.treeIsFiltered(treeName)
  }
  console.log('FormTitle', { existsTableFilter, existsTreeFilter })

  return (
    <Container showfilter={showFilter}>
      <TitleRow>
        <Title>{`${title}${showFilter ? ' Filter' : ''}`}</Title>
        {doFilter && (
          <Symbols>
            {showFilter ? (
              <StyledIconButton
                aria-label="Daten anzeigen und bearbeiten"
                title="Daten anzeigen und bearbeiten"
              >
                <StyledEditIcon onClick={onToggleShow} />
              </StyledIconButton>
            ) : (
              <StyledIconButton
                aria-label="Daten filtern"
                title="Daten filtern (BAUSTELLE)"
              >
                <StyledFilterIcon onClick={onToggleShow} />
              </StyledIconButton>
            )}
          </Symbols>
        )}
      </TitleRow>
      <TestdataMessage tree={tree} apId={apId} />
    </Container>
  )
}

export default enhance(FormTitle)
