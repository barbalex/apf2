import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { MdDeleteSweep, MdOutlineDeleteSweep } from 'react-icons/md'
import { FaTrash, FaTrashAlt } from 'react-icons/fa'
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
const StyledDeleteFilterIcon = styled(MdDeleteSweep)`
  cursor: pointer;
  pointer-events: auto;
  font-size: 1.4rem;
`
const StyledDeleteFilterIcon2 = styled(MdOutlineDeleteSweep)`
  cursor: pointer;
  pointer-events: auto;
  font-size: 1.4rem;
`

const FilterTitle = ({
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
    dataFilterTableIsFiltered,
    dataFilterTreeIsFiltered,
    dataFilterEmptyTable,
    dataFilterEmptyTree,
  } = store

  const existsTableFilter = dataFilterTableIsFiltered({
    treeName,
    table,
  })
  const existsTreeFilter = dataFilterTreeIsFiltered(treeName)

  const onEmptyTable = useCallback(
    () => dataFilterEmptyTable({ treeName, table }),
    [dataFilterEmptyTable, treeName, table],
  )
  const onEmptyTree = useCallback(
    () => dataFilterEmptyTree(treeName),
    [dataFilterEmptyTree, treeName],
  )

  // console.log('FilterTitle', {
  //   existsTableFilter,
  //   existsTreeFilter,
  //   filteredApNr,
  //   totalApNr,
  // })

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
        {existsTableFilter && (
          <IconButton
            aria-label={`${title}-Filter entfernen`}
            title={`${title}-Filter entfernen`}
            onClick={onEmptyTable}
            size="small"
          >
            <StyledDeleteFilterIcon2 />
          </IconButton>
        )}
        {existsTreeFilter && (
          <IconButton
            aria-label="Alle Filter entfernen"
            title="Alle Filter entfernen"
            onClick={onEmptyTree}
            size="small"
          >
            <StyledDeleteFilterIcon />
          </IconButton>
        )}
      </TitleRow>
    </Container>
  )
}

export default observer(FilterTitle)
