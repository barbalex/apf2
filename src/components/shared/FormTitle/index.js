// @flow
import React, { Fragment } from 'react'
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
import get from 'lodash/get'

import TestdataMessage from './TestdataMessage'
import withNodeFilterState from '../../../state/withNodeFilter'
import setTreeKeyGql from './setTreeKey.graphql'
import data from './data'

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
const StyledDeleteFilterIcon = styled(DeleteFilterIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
  color: white;
`
const StyledDeleteFilterIcon2 = styled(DeleteFilterIcon2)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
  color: white;
`
const Symbols = styled.div`
  display: flex;
`

const enhance = compose(
  data,
  withNodeFilterState,
  withHandlers({
    onToggleShow: ({ nodeFilterState, data, treeName }) => () => {
      const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
      nodeFilterState.toggleShow()
      // if active node is id, pop
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
    onEmptyTable: ({ nodeFilterState, treeName, table }) => () =>
      nodeFilterState.emptyTable({ treeName, table }),
    onEmptyTree: ({ nodeFilterState, treeName }) => () =>
      nodeFilterState.emptyTree(treeName),
  }),
)

const FormTitle = ({
  tree,
  title,
  apId,
  nodeFilterState,
  onToggleShow,
  onEmptyTable,
  onEmptyTree,
  table,
  treeName,
  data,
}: {
  tree: Object,
  title: string,
  apId: string,
  nodeFilterState: Object,
  onToggleShow: () => void,
  onEmptyTable: () => void,
  onEmptyTree: () => void,
  table: string,
  treeName: string,
  data: Object,
}) => {
  const showFilter = nodeFilterState.state.show
  const activeNodeArray = get(data, `${treeName}.activeNodeArray`)
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
  const activeNodeArrayIsThisFiltersObject =
    activeNodeArray &&
    isUuid.anyNonNil(activeNodeArray[activeNodeArray.length - 1])

  return (
    <Container showfilter={showFilter}>
      <TitleRow>
        <Title>{`${title}${showFilter ? ' Filter' : ''}`}</Title>
        {doFilter && (
          <Symbols>
            {showFilter ? (
              <Fragment>
                {activeNodeArrayIsThisFiltersObject && (
                  <StyledIconButton
                    aria-label="Daten anzeigen und bearbeiten"
                    title="Daten anzeigen und bearbeiten"
                  >
                    <StyledEditIcon onClick={onToggleShow} />
                  </StyledIconButton>
                )}
              </Fragment>
            ) : (
              <StyledIconButton
                aria-label="Daten filtern"
                title="Daten filtern (BAUSTELLE)"
              >
                <StyledFilterIcon onClick={onToggleShow} />
              </StyledIconButton>
            )}
            {existsTableFilter && (
              <StyledIconButton
                aria-label={`${title}-Filter entfernen`}
                title={`${title}-Filter entfernen`}
              >
                <StyledDeleteFilterIcon2 onClick={onEmptyTable} />
              </StyledIconButton>
            )}
            {existsTreeFilter && (
              <StyledIconButton
                aria-label="Alle Filter entfernen"
                title="Alle Filter entfernen"
              >
                <StyledDeleteFilterIcon onClick={onEmptyTree} />
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
