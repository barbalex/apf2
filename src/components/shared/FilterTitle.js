import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import DeleteFilterIcon from '@material-ui/icons/DeleteSweep'
import DeleteFilterIcon2 from '@material-ui/icons/DeleteSweepOutlined'
import IconButton from '@material-ui/core/IconButton'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'
import exists from '../../modules/exists'

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
  height: 34px !important;
  width: 34px !important;
  margin-top: -2px !important;
`
const StyledDeleteFilterIcon = styled(DeleteFilterIcon)`
  cursor: pointer;
  pointer-events: auto;
  /*font-size: 28px !important;*/
`
const StyledDeleteFilterIcon2 = styled(DeleteFilterIcon2)`
  cursor: pointer;
  pointer-events: auto;
  /*font-size: 28px !important;*/
`

const FormTitle = ({
  title,
  table,
  treeName,
  totalNr,
  filteredNr,
  totalApNr,
  filteredApNr,
}) => {
  const store = useContext(storeContext)
  const {
    nodeFilterTableIsFiltered,
    nodeFilterTreeIsFiltered,
    nodeFilterEmptyTable,
    nodeFilterEmptyTree,
  } = store

  const existsTableFilter = nodeFilterTableIsFiltered({
    treeName,
    table,
  })
  const existsTreeFilter = nodeFilterTreeIsFiltered(treeName)

  const onEmptyTable = useCallback(
    () => nodeFilterEmptyTable({ treeName, table }),
    [nodeFilterEmptyTable, treeName, table],
  )
  const onEmptyTree = useCallback(() => nodeFilterEmptyTree(treeName), [
    nodeFilterEmptyTree,
    treeName,
  ])

  return (
    <Container>
      <TitleRow>
        <FilterNumbers>
          {exists(filteredApNr) && (
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
