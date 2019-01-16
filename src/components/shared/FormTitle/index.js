// @flow
import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import FilterIcon from '@material-ui/icons/FilterList'
import DeleteFilterIcon from '@material-ui/icons/DeleteSweep'
import DeleteFilterIcon2 from '@material-ui/icons/DeleteSweepOutlined'
import IconButton from '@material-ui/core/IconButton'
import isUuid from 'is-uuid'
import get from 'lodash/get'
import { observer } from 'mobx-react-lite'

import TestdataMessage from './TestdataMessage'
import types from '../../../mobxStore/NodeFilterTree/initialValues'
import mobxStoreContext from '../../../mobxStoreContext'

const Container = styled.div`
  background-color: ${props => (props.showfilter ? '#D84315' : '#388e3c')};
  padding-bottom: 10px;
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
  padding: 10px 10px 0 10px;
  color: white;
  font-weight: bold;
`
const StyledIconButton = styled(IconButton)`
  height: 30px !important;
  width: 30px !important;
  margin-right: 5px !important;
  padding-top: 3px !important;
`
const StyledFilterIcon = styled(FilterIcon)`
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

const FormTitle = ({
  title,
  apId,
  table,
  treeName,
}: {
  title: string,
  apId: string,
  table: string,
  treeName: string,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const {
    nodeFilter,
    nodeFilterTableIsFiltered,
    nodeFilterTreeIsFiltered,
    nodeFilterSetActiveTable,
    nodeFilterEmptyTable,
    nodeFilterEmptyTree,
    setTreeKey,
  } = mobxStore

  const typesExist = !!types[table]
  const showFilter = !!treeName && !!nodeFilter[treeName].activeTable
  let existsTableFilter
  let existsTreeFilter
  const doFilter = table && treeName
  if (doFilter) {
    existsTableFilter = nodeFilterTableIsFiltered({
      treeName,
      table,
    })
    existsTreeFilter = nodeFilterTreeIsFiltered(treeName)
  }
  const activeNodeArray = get(mobxStore, `${treeName}.activeNodeArray`)

  const onFilter = useCallback(
    () => {
      nodeFilterSetActiveTable({ treeName, activeTable: table })
      // if active node is id, pop
      if (
        activeNodeArray &&
        treeName &&
        isUuid.anyNonNil(activeNodeArray[activeNodeArray.length - 1])
      ) {
        const newActiveNodeArray = activeNodeArray.slice(0, -1)
        setTreeKey({
          value: newActiveNodeArray,
          tree: treeName,
          key: 'activeNodeArray',
        })
      }
    },
    [activeNodeArray, treeName],
  )
  const onEmptyTable = useCallback(
    () => nodeFilterEmptyTable({ treeName, table }),
    [treeName, table],
  )
  const onEmptyTree = useCallback(() => nodeFilterEmptyTree(treeName), [
    treeName,
  ])

  return (
    <Container showfilter={showFilter}>
      <TitleRow>
        <Title>{`${title}${showFilter ? ' Filter' : ''}`}</Title>
        {doFilter && (
          <Symbols>
            {!showFilter && typesExist && (
              <StyledIconButton
                aria-label="Daten filtern"
                title={`${table ? table : 'Daten'} filtern`}
                onClick={onFilter}
              >
                <StyledFilterIcon />
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
      <TestdataMessage treeName={treeName} apId={apId} />
    </Container>
  )
}

export default observer(FormTitle)
