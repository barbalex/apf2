import React, { useContext, useMemo } from 'react'
import { useQuery } from 'react-apollo-hooks'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'

import queryTpop from './queryTpop'
import queryLists from './queryLists'
import Row from './Row'
import CellForYearMenu from './Row/CellForYearMenu'
import storeContext from '../../../storeContext'
import yearsFromTpops from './yearsFromTpops'
import rowFromTpop from './yearRowFromTpop'

const Container = styled.div`
  padding: 10px;
  user-select: none !important;
`
const OuterTableContainer = styled.div`
  position: relative;
`
const TableContainer = styled.div`
  position: relative;
  overflow: auto;
  width: 100vw;
  height: ${props => `calc(100vh - ${props.headerbottom}px)`};
`
const StyledTable = styled(Table)`
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  border-collapse: separate;
  border-spacing: 0;
  thead > tr > th.${props => props.colhovered} {
    background: hsla(120, 25%, 82%, 1) !important;
    font-weight: 800 !important;
  }
  tbody > tr > td.${props => props.colhovered} {
    background: hsla(45, 100%, 90%, 1);
  }
`
const StyledTableHead = styled(TableHead)`
  display: block !important;
  background: hsla(120, 25%, 88%, 1) !important;
  height: 60px !important;
  position: sticky;
  top: 0;
  z-index: 2;
`
const StyledTableHeaderRow = styled(TableRow)`
  position: relative !important;
  display: block !important;
  height: 60px !important;
`
const StyledTableHeaderCell = styled(TableCell)`
  position: sticky;
  height: 60px;
  width: ${props => `${props.width}px`};
  min-width: ${props => `${props.width}px`};
  max-width: ${props => `${props.width}px`};
  text-align: ${props =>
    props['data-centertext'] ? 'center !important' : 'inherit'};
  font-weight: 500 !important;
  font-size: 0.75rem !important;
  color: black !important;
  padding: 2px 4px !important;
  line-height: 1rem !important;
  border-left: solid hsla(120, 25%, 70%, 1) 1px;
  border-right: solid hsla(120, 25%, 70%, 1) 1px;
  background: hsla(120, 25%, 88%, 1);
  left: ${props =>
    props['data-left'] === undefined ? 'unset' : `${props['data-left']}px`};
  z-index: ${props => (props['data-left'] === undefined ? 0 : 1)};
  &:first-child {
    padding-left: 10px !important;
  }
`
const StyledTableBody = styled(TableBody)`
  display: block !important;
`
export const EkTableCell = styled(TableCell)`
  position: sticky;
  width: ${props => `${props.width}px`};
  min-width: ${props => `${props.width}px`};
  max-width: ${props => `${props.width}px`};
  font-size: 0.75rem !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  padding: 2px 4px !important;
  border-left: solid hsla(70, 80%, 75%, 1) 1px;
  border-right: solid hsla(70, 80%, 75%, 1) 1px;
  background: ${props =>
    props['data-clicked'] ? 'rgb(255,211,167) !important' : 'unset'};
  left: ${props =>
    props['data-left'] === undefined ? 'unset' : `${props['data-left']}px`};
  z-index: ${props => (props['data-left'] === undefined ? 0 : 1)};
  &:first-child {
    padding-left: 10px !important;
  }
  div {
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }
`
export const TableCellForSelect = styled(EkTableCell)`
  padding: 0 !important;
  font-size: unset !important;
  border-left: solid green 1px;
  border-right: solid green 1px;
  &:focus-within {
    border: solid orange 3px;
  }
`
export const TableCellForYear = styled(EkTableCell)`
  &:focus-within {
    border: solid orange 3px;
  }
`
export const InfoRow = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`
const TpopTitle = styled.h4`
  position: absolute;
  left: 10px;
  z-index: 3;
`

const EkPlanTable = ({ headerBottom }) => {
  const store = useContext(storeContext)
  const {
    aps,
    apValues,
    showCount,
    fields: fieldsShown,
    yearMenuAnchor,
    resetYearHovered,
    columnHovered,
    setColumnHovered,
    scrollPositions,
    setEkfrequenzs,
    setEkAbrechnungstypOptions,
  } = store.ekPlan

  const {
    data: dataTpop,
    loading: loadingTpop,
    error: errorTpop,
    refetch,
  } = useQuery(queryTpop, {
    variables: {
      aps: apValues,
    },
  })
  const tpops = sortBy(
    get(dataTpop, 'allTpops.nodes', []),
    t => t.popByPopId.apByApId.label,
  )
  const years = useMemo(() => yearsFromTpops(tpops), [tpops])
  const rows = useMemo(
    () =>
      tpops.map(tpop =>
        rowFromTpop({
          tpop,
          years,
          showCount,
        }),
      ),
    [tpops, years, showCount],
  )
  const headerFields = useMemo(
    () =>
      rows.length
        ? sortBy(
            Object.values(rows[0])
              .filter(o => typeof o === 'object')
              .filter(o => !!o.name)
              .filter(o => fieldsShown.includes(o.name) || !!o.alwaysShow),
            'sort',
          )
        : [],
    [rows[0], fieldsShown],
  )

  const { data: dataLists } = useQuery(queryLists, {
    variables: {
      apIds: apValues,
    },
  })
  setEkfrequenzs(get(dataLists, 'allEkfrequenzs.nodes', []))
  setEkAbrechnungstypOptions(
    get(dataLists, 'allEkAbrechnungstypWertes.nodes', []),
  )

  //console.log('Table rendering')

  if (aps.length > 0 && loadingTpop) return <Container>Lade...</Container>
  if (errorTpop) return <Container>{errorTpop.message}</Container>
  return (
    <ErrorBoundary>
      <>
        {rows.length > 0 && (
          <OuterTableContainer>
            <TpopTitle>{`${rows.length} Teilpopulationen`}</TpopTitle>
            <TableContainer headerbottom={headerBottom}>
              <StyledTable size="small" colhovered={columnHovered}>
                <StyledTableHead>
                  <StyledTableHeaderRow>
                    {headerFields.map(f => (
                      <StyledTableHeaderCell
                        key={f.name}
                        width={f.width}
                        onMouseEnter={() =>
                          f.label > 1000 &&
                          f.label < 3000 &&
                          setColumnHovered(`_${f.label}_`)
                        }
                        onMouseLeave={resetYearHovered}
                        data-left={scrollPositions[f.name]}
                        data-centertext={f.label > 1000 && f.label < 3000}
                        className={`_${f.name}_`}
                      >
                        {f.label}
                      </StyledTableHeaderCell>
                    ))}
                  </StyledTableHeaderRow>
                </StyledTableHead>
                <StyledTableBody>
                  {rows.map(row => (
                    <Row key={row.id} row={row} />
                  ))}
                </StyledTableBody>
              </StyledTable>
            </TableContainer>
          </OuterTableContainer>
        )}
        {!!yearMenuAnchor && <CellForYearMenu refetch={refetch} />}
      </>
    </ErrorBoundary>
  )
}

export default observer(EkPlanTable)
