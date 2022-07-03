import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { MdDeleteSweep, MdOutlineDeleteSweep } from 'react-icons/md'
import { FaTrash, FaTrashAlt, FaRegTrashAlt } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import { observer } from 'mobx-react-lite'

import storeContext from '../../storeContext'
import exists from '../../modules/exists'

const Container = styled.div`
  background-color: #ffd3a7;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-height: 46px;
  @media print {
    display: none !important;
  }
`
const TitleRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const FilterNumbers = styled.div`
  padding-right: 8px;
  cursor: default;
  user-select: none;
  margin-top: 2px;
`
const StyledDeleteFilterIcon = styled(FaTrash)`
  cursor: pointer;
  pointer-events: auto;
`
const StyledDeleteFilterIcon2 = styled(FaTrashAlt)`
  cursor: pointer;
  pointer-events: auto;
`
const StyledDeleteFilterIcon3 = styled(FaRegTrashAlt)`
  cursor: pointer;
  pointer-events: auto;
`

const FilterTitle = ({
  title,
  table,
  treeName,
  totalNr,
  filteredNr,
  totalApNr,
  filteredApNr,
  activeTab,
}) => {
  const store = useContext(storeContext)
  const {
    dataFilterTableIsFiltered,
    dataFilterTreeIsFiltered,
    dataFilterEmptyTab,
    dataFilterEmptyTable,
    dataFilterEmptyTree,
  } = store

  const existsTableFilter = dataFilterTableIsFiltered({
    treeName,
    table,
  })
  const existsTreeFilter = dataFilterTreeIsFiltered(treeName)

  const onEmptyTab = useCallback(
    () => dataFilterEmptyTab({ treeName, table, activeTab }),
    [dataFilterEmptyTab, treeName, table, activeTab],
  )
  const onEmptyTable = useCallback(
    () => dataFilterEmptyTable({ treeName, table }),
    [dataFilterEmptyTable, treeName, table],
  )
  const onEmptyTree = useCallback(
    () => dataFilterEmptyTree(treeName),
    [dataFilterEmptyTree, treeName],
  )

  return (
    <Container>
      <TitleRow>
        <FilterNumbers>
          {exists(filteredApNr) && (
            <>
              {`Art: `}
              <span title="gefilterte Anzahl in Art">{filteredApNr}</span>/
              <span title="ungefilterte Anzahl in Art">{totalApNr}</span>
              {`, `}
            </>
          )}
          {`Projekt: `}
          <span title="gefilterte Anzahl im Projekt">{filteredNr}</span>/
          <span title="ungefilterte Anzahl im Projekt">{totalNr}</span>
        </FilterNumbers>
        {activeTab !== undefined && (
          <IconButton
            aria-label={`Aktuelles Filter-Kriterium entfernen`}
            title={`Aktuelles Filter-Kriterium entfernen`}
            onClick={onEmptyTab}
            size="small"
            disabled={!existsTableFilter}
          >
            <StyledDeleteFilterIcon3 />
          </IconButton>
        )}
        <IconButton
          aria-label={`${title}-Filter entfernen`}
          title={`${title}-Filter entfernen`}
          onClick={onEmptyTable}
          size="small"
          disabled={!existsTableFilter}
        >
          <StyledDeleteFilterIcon2 />
        </IconButton>
        <IconButton
          aria-label="Alle Filter entfernen"
          title="Alle Filter entfernen"
          onClick={onEmptyTree}
          size="small"
          disabled={!existsTreeFilter}
        >
          <StyledDeleteFilterIcon />
        </IconButton>
      </TitleRow>
    </Container>
  )
}

export default observer(FilterTitle)
