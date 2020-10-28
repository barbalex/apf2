import React, { useContext, useCallback, useEffect } from 'react'
import styled from 'styled-components'
// this does not exist in any icon library, not even in md!!!!
import DeleteSweepOutlined from '@material-ui/icons/DeleteSweepOutlined'
import { MdDeleteSweep } from 'react-icons/md'
import IconButton from '@material-ui/core/IconButton'
import { observer } from 'mobx-react-lite'
import { withResizeDetector } from 'react-resize-detector'

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
  width: 34px !important;
  margin-top: -2px !important;
`
const StyledDeleteFilterIcon = styled(MdDeleteSweep)`
  cursor: pointer;
  pointer-events: auto;
  font-size: 1.5rem;
  flex-shrink: 0;
`
const StyledDeleteFilterIcon2 = styled(DeleteSweepOutlined)`
  cursor: pointer;
  pointer-events: auto;
`

const FormTitle = ({
  title,
  table,
  treeName,
  totalNr,
  filteredNr,
  totalApNr,
  filteredApNr,
  height = 43,
  setFormTitleHeight = () => {},
}) => {
  const store = useContext(storeContext)
  const {
    dataFilterTableIsFiltered,
    dataFilterTreeIsFiltered,
    dataFilterEmptyTable,
    dataFilterEmptyTree,
  } = store

  useEffect(() => {
    setFormTitleHeight(height)
  }, [height, setFormTitleHeight])

  const existsTableFilter = dataFilterTableIsFiltered({
    treeName,
    table,
  })
  const existsTreeFilter = dataFilterTreeIsFiltered(treeName)

  const onEmptyTable = useCallback(
    () => dataFilterEmptyTable({ treeName, table }),
    [dataFilterEmptyTable, treeName, table],
  )
  const onEmptyTree = useCallback(() => dataFilterEmptyTree(treeName), [
    dataFilterEmptyTree,
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

export default withResizeDetector(observer(FormTitle))
