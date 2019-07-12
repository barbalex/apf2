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
import sumBy from 'lodash/sumBy'
import { observer } from 'mobx-react-lite'
import {
  FixedSizeGrid as Grid,
  VariableSizeList as List,
  FixedSizeList,
} from 'react-window'

import queryTpop from './queryTpop'
import queryLists from './queryLists'
import Row from './Row'
import CellForYearMenu from './Row/CellForYearMenu'
import storeContext from '../../../storeContext'
import yearsFromTpops from './yearsFromTpops'
import rowFromTpop from './rowFromTpop'
import fields from './fields'
import yearColumnWidth from './yearColumnWidth'
import FixedHeaderCell from './FixedHeaderCell'
import YearHeaderCell from './YearHeaderCell'

const TempContainer = styled.div`
  padding: 10px;
  user-select: none !important;
`
const Container = styled.div`
  position: relative;
  width: 100vw;
  height: ${props => `calc(100vh - ${props.headerbottom}px)`};
  display: flex;
  flex-direction: column;
`
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
const BodyContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
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
export const StyledYearHeaderCell = styled.div`
  text-align: center;
  font-weight: 500;
  font-size: 0.75rem;
  color: black;
  line-height: 60px;
  border-left: solid hsla(120, 25%, 70%, 1) 1px;
  border-right: solid hsla(120, 25%, 70%, 1) 1px;
  background: hsla(120, 25%, 88%, 1);
  span {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
    padding: 2px 4px;
  }
  &:first-child span {
    padding-left: 10px;
  }
  &.hovered {
    background: hsla(120, 25%, 82%, 1) !important;
    font-weight: 800 !important;
  }
`
export const StyledFixedHeaderCell = styled(StyledYearHeaderCell)`
  text-align: left;
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

const EkPlanTable = ({ headerBottom, width, height }) => {
  const store = useContext(storeContext)
  const {
    aps,
    apValues,
    showCount,
    fields: fieldsShown,
    yearMenuAnchor,
    resetYearHovered,
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
  const headerFieldsFixed = rows.length
    ? sortBy(
        Object.values(fields).filter(
          o => fieldsShown.includes(o.name) || !!o.alwaysShow,
        ),
        'sort',
      )
    : []
  const headerFieldsFixedWidth = sumBy(headerFieldsFixed, 'width')

  const { data: dataLists } = useQuery(queryLists, {
    variables: {
      apIds: apValues,
    },
  })
  setEkfrequenzs(get(dataLists, 'allEkfrequenzs.nodes', []))
  setEkAbrechnungstypOptions(
    get(dataLists, 'allEkAbrechnungstypWertes.nodes', []),
  )

  const yearColWidth = yearColumnWidth(showCount)
  const headerYearFieldsWidth = width - headerFieldsFixedWidth

  console.log('Table rendering:', {
    headerYearFieldsWidth,
    width,
    height,
  })

  if (aps.length > 0 && loadingTpop)
    return <TempContainer>Lade...</TempContainer>
  if (errorTpop) return <TempContainer>{errorTpop.message}</TempContainer>
  return (
    <ErrorBoundary>
      <Container headerbottom={headerBottom}>
        <TpopTitle>{`${rows.length} Teilpopulationen`}</TpopTitle>
        <HeaderContainer>
          <List
            key={headerFieldsFixed.length}
            height={60}
            itemCount={headerFieldsFixed.length}
            itemSize={index => headerFieldsFixed[index].width}
            layout="horizontal"
            width={headerFieldsFixedWidth}
          >
            {({ index, style }) => (
              <FixedHeaderCell
                style={style}
                column={headerFieldsFixed[index]}
              />
            )}
          </List>
          <FixedSizeList
            height={60}
            itemCount={years.length}
            itemSize={yearColWidth}
            layout="horizontal"
            width={headerYearFieldsWidth}
          >
            {({ index, style }) => (
              <YearHeaderCell style={style} column={years[index]} />
            )}
          </FixedSizeList>
        </HeaderContainer>
        <BodyContainer>TODO</BodyContainer>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlanTable)
