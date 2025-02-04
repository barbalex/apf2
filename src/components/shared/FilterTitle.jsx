import { useContext, useCallback, memo } from 'react'
import styled from '@emotion/styled'
import { FaTrash, FaTrashAlt, FaRegTrashAlt } from 'react-icons/fa'
import { MdInfoOutline } from 'react-icons/md'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../mobxContext.js'
import { exists } from '../../modules/exists.js'
import { appBaseUrl } from '../../modules/appBaseUrl.js'

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
const StyledInfoIcon = styled(MdInfoOutline)``

export const FilterTitle = memo(
  observer(({ title, table, totalNr, filteredNr, activeTab }) => {
    const store = useContext(MobxContext)
    const { tableIsFiltered, dataFilterTreeIsFiltered } = store
    const {
      emptyMapFilter,
      dataFilterEmpty,
      dataFilterEmptyTab,
      dataFilterEmptyTable,
      setApFilter,
    } = store.tree

    const existsTableFilter = tableIsFiltered(table)
    const existsTreeFilter = dataFilterTreeIsFiltered()

    const onEmptyTab = useCallback(
      () => dataFilterEmptyTab({ table, activeTab }),
      [dataFilterEmptyTab, table, activeTab],
    )
    const onEmptyTable = useCallback(
      () => dataFilterEmptyTable({ table }),
      [dataFilterEmptyTable, table],
    )
    const onEmptyTree = useCallback(() => {
      store.tree.nodeLabelFilter.empty()
      dataFilterEmpty()
      emptyMapFilter()
      setApFilter(false)
    }, [dataFilterEmpty, emptyMapFilter, setApFilter, store])

    const onClickInfo = useCallback(() => {
      const url = `${appBaseUrl()}Dokumentation/filter`
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return window.open(url, '_blank', 'toolbar=no')
      }
      window.open(url)
    }, [])

    return (
      <Container>
        <TitleRow>
          <FilterNumbers>
            {exists(filteredNr) && (
              <>
                <span title="gefilterte Anzahl">
                  {filteredNr?.toLocaleString('de-ch')}
                </span>
                /
                <span title="ungefilterte Anzahl">
                  {totalNr?.toLocaleString('de-ch')}
                </span>
              </>
            )}
          </FilterNumbers>
          {activeTab !== undefined && (
            <Tooltip title={`Aktuelles Filter-Kriterium entfernen`}>
              <IconButton
                aria-label={`Aktuelles Filter-Kriterium entfernen`}
                onClick={onEmptyTab}
                size="small"
                disabled={!existsTableFilter}
              >
                <StyledDeleteFilterIcon3 />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={`${title}-Filter entfernen`}>
            <IconButton
              aria-label={`${title}-Filter entfernen`}
              onClick={onEmptyTable}
              size="small"
              disabled={!existsTableFilter}
            >
              <StyledDeleteFilterIcon2 />
            </IconButton>
          </Tooltip>
          <Tooltip title="Alle Filter entfernen">
            <IconButton
              aria-label="Alle Filter entfernen"
              onClick={onEmptyTree}
              size="small"
              disabled={!existsTreeFilter}
            >
              <StyledDeleteFilterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter-Dokumentation">
            <IconButton
              aria-label="Filter-Dokumentation"
              size="medium"
              onClick={onClickInfo}
            >
              <StyledInfoIcon />
            </IconButton>
          </Tooltip>
        </TitleRow>
      </Container>
    )
  }),
)
