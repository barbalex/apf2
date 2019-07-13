import React, {
  useContext,
  useMemo,
  useCallback,
  useReducer,
  useRef,
} from 'react'
import { useQuery } from 'react-apollo-hooks'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import sumBy from 'lodash/sumBy'
import { observer } from 'mobx-react-lite'
import {
  FixedSizeGrid,
  VariableSizeGrid,
  VariableSizeList,
  FixedSizeList,
} from 'react-window'
import ReactResizeDetector from 'react-resize-detector'

import queryTpop from './queryTpop'
import queryLists from './queryLists'
import CellForYearMenu from './CellForYearMenu'
import storeContext from '../../../storeContext'
import yearsFromTpops from './yearsFromTpops'
import tpopRowFromTpop from './tpopRowFromTpop'
import yearRowFromTpop from './yearRowFromTpop'
import fields from './fields'
import yearColumnWidth from './yearColumnWidth'
import CellHeaderFixed from './CellHeaderFixed'
import CellHeaderYear from './CellHeaderYear'
import CellForYearTitle from './CellForYearTitle'
import CellForEkAbrechnungstyp from './CellForEkAbrechnungstyp'
import CellForEkfrequenz from './CellForEkfrequenz'
import CellForEkfrequenzAbweichend from './CellForEkfrequenzAbweichend'
import CellForTpopLink from './CellForTpopLink'
import CellForValue from './CellForValue'
import CellForYear from './CellForYear'

const TempContainer = styled.div`
  padding: 10px;
  user-select: none !important;
`
const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100%;
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
  flex-direction: row;
  height: 100%;
  width: 100%;
`
export const StyledYearHeaderCell = styled.div`
  text-align: center;
  font-weight: 500;
  font-size: 0.75rem;
  color: black;
  line-height: 60px;
  border-left: solid hsla(120, 25%, 70%, 1) 1px;
  border-right: solid hsla(120, 25%, 70%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
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
  &.column-hovered {
    background: hsla(120, 25%, 82%, 1) !important;
    font-weight: 800 !important;
  }
`
export const StyledFixedHeaderCell = styled(StyledYearHeaderCell)`
  text-align: left;
`
export const StyledTableCell = styled.div`
  font-size: 0.75rem !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  padding: 2px 4px !important;
  border-left: solid hsla(70, 80%, 75%, 1) 1px;
  border-right: solid hsla(70, 80%, 75%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  background: ${props =>
    props['data-clicked']
      ? 'rgb(255,211,167) !important'
      : props['data-isodd']
      ? 'rgb(255, 255, 252)'
      : 'unset'};
  &:first-child {
    padding-left: 10px !important;
  }
  &.tpop-hovered {
    background-color: hsla(45, 100%, 90%, 1);
  }
  &.column-hovered {
    background-color: hsla(45, 100%, 90%, 1);
  }
  div {
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }
`
export const StyledCellForSelect = styled(StyledTableCell)`
  padding: 0 !important;
  font-size: unset !important;
  border-left: solid green 1px;
  border-right: solid green 1px;
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
function sizeReducer(state, action) {
  return action.payload
}

const EkPlanTable = () => {
  const store = useContext(storeContext)
  const {
    aps,
    apValues,
    showCount,
    fields: fieldsShown,
    yearMenuAnchor,
    setEkfrequenzs,
    setEkAbrechnungstypOptions,
    showEk,
    showEkf,
    showMassn,
  } = store.ekPlan

  const [sizeState, sizeDispatch] = useReducer(sizeReducer, {
    width: 0,
    height: 0,
  })
  const onResize = useCallback(
    (width, height) => sizeDispatch({ payload: { width, height } }),
    [],
  )

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
  const yearRows = useMemo(
    () =>
      tpops.map((tpop, index) =>
        yearRowFromTpop({
          tpop,
          years,
          showCount,
          index,
        }),
      ),
    [tpops, years, showCount],
  )
  const yearColumns = yearRows.length
    ? sortBy(
        Object.values(yearRows[0])
          .filter(o => typeof o === 'object')
          .filter(o => !!o.value && !!o.value.eks)
          .filter(o => !!o.name),
        'sort',
      )
    : []
  const tpopRows = useMemo(() => tpops.map(tpopRowFromTpop), [tpops])
  const tpopColumns = tpopRows.length
    ? sortBy(
        Object.values(tpopRows[0])
          .filter(o => typeof o === 'object')
          .filter(o => !!o.name)
          .filter(o => fieldsShown.includes(o.name) || !!o.alwaysShow),
        'sort',
      )
    : []
  const headerFieldsFixed = tpops.length
    ? sortBy(
        Object.values(fields).filter(
          o => fieldsShown.includes(o.name) || !!o.alwaysShow,
        ),
        'sort',
      )
    : []
  let headerFieldsFixedWidth = sumBy(headerFieldsFixed, 'width')
  if (headerFieldsFixedWidth > sizeState.width)
    headerFieldsFixedWidth = sizeState.width

  const tpopGrid = useRef(null)
  const yearHeaderGrid = useRef(null)

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
  let headerYearFieldsWidth = sizeState.width - headerFieldsFixedWidth
  if (headerYearFieldsWidth < 0) headerYearFieldsWidth = 0

  const showsLength = [showEk, showEkf, showMassn].filter(s => !!s).length
  const rowHeight = 31 + (!!showsLength ? showsLength - 1 : 0) * 12

  /*console.log('Table rendering:', {
    yearRows,
    tpopRows,
    yearColumns,
    headerYearFieldsWidth,
    headerFieldsFixedWidth,
    width: sizeState.width,
  })*/
  const onScroll = ({ scrollTop, scrollLeft, scrollUpdateWasRequested }) => {
    if (!scrollUpdateWasRequested) {
      tpopGrid.current && tpopGrid.current.scrollTo({ scrollTop })
      yearHeaderGrid.current &&
        scrollLeft &&
        yearHeaderGrid.current.scrollTo({ scrollLeft })
    }
  }

  if (aps.length > 0 && loadingTpop)
    return <TempContainer>Lade...</TempContainer>
  if (errorTpop) return <TempContainer>{errorTpop.message}</TempContainer>
  return (
    <ErrorBoundary>
      <>
        <Container>
          <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
          <HeaderContainer>
            <TpopTitle>{`${tpops.length} Teilpopulationen`}</TpopTitle>
            <VariableSizeList
              key={headerFieldsFixed.length}
              height={60}
              itemCount={headerFieldsFixed.length}
              itemSize={index => headerFieldsFixed[index].width}
              layout="horizontal"
              width={headerFieldsFixedWidth}
            >
              {({ index, style }) => (
                <CellHeaderFixed
                  style={style}
                  column={headerFieldsFixed[index]}
                />
              )}
            </VariableSizeList>
            <FixedSizeList
              style={{ overflow: 'hidden' }}
              ref={yearHeaderGrid}
              height={60}
              itemCount={years.length}
              itemSize={yearColWidth}
              layout="horizontal"
              width={headerYearFieldsWidth}
            >
              {({ index, style }) => (
                <CellHeaderYear style={style} column={years[index]} />
              )}
            </FixedSizeList>
          </HeaderContainer>
          <BodyContainer>
            <VariableSizeGrid
              ref={tpopGrid}
              style={{ overflowY: 'hidden' }}
              columnCount={tpopColumns.length}
              columnWidth={index => tpopColumns[index].width}
              height={sizeState.height - 60}
              rowCount={tpopRows.length}
              rowHeight={() => rowHeight}
              width={headerFieldsFixedWidth}
            >
              {({ columnIndex, rowIndex, style }) => {
                const row = tpopRows[rowIndex]
                const column = tpopColumns[columnIndex].name
                const value = row[column]
                if (value.name === 'yearTitle') {
                  return (
                    <CellForYearTitle
                      key={value.name}
                      style={style}
                      row={row}
                    />
                  )
                }
                if (value.name === 'ekAbrechnungstyp') {
                  return (
                    <CellForEkAbrechnungstyp
                      key={value.name}
                      row={row}
                      field={value}
                      style={style}
                    />
                  )
                }
                if (value.name === 'ekfrequenz') {
                  return (
                    <CellForEkfrequenz
                      key={value.name}
                      row={row}
                      field={value}
                      style={style}
                    />
                  )
                }
                if (value.name === 'ekfrequenzAbweichend') {
                  return (
                    <CellForEkfrequenzAbweichend
                      key={value.name}
                      row={row}
                      field={value}
                      style={style}
                    />
                  )
                }
                if (value.name === 'link') {
                  return (
                    <CellForTpopLink
                      key={value.name}
                      field={value}
                      style={style}
                      row={row}
                    />
                  )
                }
                return (
                  <CellForValue
                    key={value.label}
                    field={value}
                    style={style}
                    row={row}
                  />
                )
              }}
            </VariableSizeGrid>
            <FixedSizeGrid
              columnCount={yearColumns.length}
              columnWidth={yearColWidth}
              height={sizeState.height - 60}
              rowCount={yearRows.length}
              rowHeight={rowHeight}
              width={sizeState.width - headerFieldsFixedWidth}
              onScroll={onScroll}
            >
              {({ columnIndex, rowIndex, style }) => {
                const row = yearRows[rowIndex]
                const column = yearColumns[columnIndex].name
                const value = row[column]
                //console.log('Table, rendering Grid', { column, row, value })

                return <CellForYear row={row} field={value} style={style} />
              }}
            </FixedSizeGrid>
          </BodyContainer>
        </Container>
        {!!yearMenuAnchor && <CellForYearMenu refetch={refetch} />}
      </>
    </ErrorBoundary>
  )
}

export default observer(EkPlanTable)
