// @flow
import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import DeleteFilterIcon from '@material-ui/icons/DeleteSweep'
import DeleteFilterIcon2 from '@material-ui/icons/DeleteSweepOutlined'
import IconButton from '@material-ui/core/IconButton'
import { observer } from 'mobx-react-lite'

import mobxStoreContext from '../../mobxStoreContext'

const Container = styled.div`
  background-color: #ffd3a7;
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
  justify-content: center;
`
const FilterNumbers = styled.div`
  padding-top: 11px;
  padding-right: 8px;
  cursor: default;
  user-select: none;
`
const StyledIconButton = styled(IconButton)`
  height: 30px !important;
  width: 30px !important;
  margin-right: 5px !important;
  padding-top: 3px !important;
`
const StyledDeleteFilterIcon = styled(DeleteFilterIcon)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
`
const StyledDeleteFilterIcon2 = styled(DeleteFilterIcon2)`
  cursor: pointer;
  pointer-events: auto;
  padding-top: 5px;
`

const FormTitle = ({
  title,
  table,
  treeName,
  totalNr,
  filteredNr,
  totalApNr,
  filteredApNr,
}: {
  title: string,
  table: string,
  treeName: string,
  totalNr: number,
  filteredNr: number,
  totalApNr: number,
  filteredApNr: number,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const {
    nodeFilterTableIsFiltered,
    nodeFilterTreeIsFiltered,
    nodeFilterEmptyTable,
    nodeFilterEmptyTree,
  } = mobxStore

  const existsTableFilter = nodeFilterTableIsFiltered({
    treeName,
    table,
  })
  const existsTreeFilter = nodeFilterTreeIsFiltered(treeName)

  const onEmptyTable = useCallback(
    () => nodeFilterEmptyTable({ treeName, table }),
    [treeName, table],
  )
  const onEmptyTree = useCallback(() => nodeFilterEmptyTree(treeName), [
    treeName,
  ])

  return (
    <Container>
      <TitleRow>
        <FilterNumbers>
          {filteredApNr && (
            <>
              {`AP: `}
              <span title="gefilterte Anzahl im Aktionsplan">
                {filteredApNr}
              </span>
              /
              <span title="ungefilterte Anzahl im Aktionsplan">
                {totalApNr}
              </span>
              {`, `}
            </>
          )}
          {`Projekt: `}
          <span title="gefilterte Anzahl im Projekt">{filteredNr}</span>/
          <span title="ungefilterte Anzahl im Projekt">{totalNr}</span>
        </FilterNumbers>
        {existsTableFilter && (
          <StyledIconButton
            aria-label={`${title}-Filter entfernen`}
            title={`${title}-Filter entfernen`}
            onClick={onEmptyTable}
          >
            <StyledDeleteFilterIcon2 />
          </StyledIconButton>
        )}
        {existsTreeFilter && (
          <StyledIconButton
            aria-label="Alle Filter entfernen"
            title="Alle Filter entfernen"
            onClick={onEmptyTree}
          >
            <StyledDeleteFilterIcon />
          </StyledIconButton>
        )}
      </TitleRow>
    </Container>
  )
}

export default observer(FormTitle)
