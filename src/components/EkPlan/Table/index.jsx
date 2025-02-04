import { memo, useContext, useMemo, useCallback, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import styled from '@emotion/styled'
import sortBy from 'lodash/sortBy'
import sumBy from 'lodash/sumBy'
import { observer } from 'mobx-react-lite'
import { FixedSizeGrid, VariableSizeGrid, VariableSizeList } from 'react-window'
import Button from '@mui/material/Button'
import { useResizeDetector } from 'react-resize-detector'
import { getSnapshot } from 'mobx-state-tree'

import { MobxContext } from '../../../mobxContext.js'
import { queryAll } from './queryAll.js'
import { CellForYearMenu } from './CellForYearMenu/index.jsx'
import { yearsFromTpops } from './yearsFromTpops.js'
import { tpopRowFromTpop } from './tpopRowFromTpop.js'
import { yearRowFromTpop } from './yearRowFromTpop.js'
import { fields } from './fields.js'
import { yearColumnWidth } from './yearColumnWidth.js'
import { CellHeaderFixed } from './CellHeaderFixed/index.jsx'
import { CellHeaderFixedEkfrequenz } from './CellHeaderFixedEkfrequenz.jsx'
import { CellHeaderFixedEkfrequenzStartjahr } from './CellHeaderFixedEkfrequenzStartjahr.jsx'
import { CellHeaderFixedTpopStatus } from './CellHeaderFixedTpopStatus/index.jsx'
import { CellHeaderYear } from './CellHeaderYear.jsx'
import { CellForYearTitle } from './CellForYearTitle.jsx'
import { CellForEkfrequenz } from './CellForEkfrequenz.jsx'
import { CellForEkfrequenzStartjahr } from './CellForEkfrequenzStartjahr.jsx'
import { CellForEkfrequenzAbweichend } from './CellForEkfrequenzAbweichend.jsx'
import { CellForTpopLink } from './CellForTpopLink.jsx'
import { CellForValue } from './CellForValue.jsx'
import { CellForYear } from './CellForYear/index.jsx'
import { Error } from '../../shared/Error.jsx'
import { exportRowFromTpop } from './exportRowFromTpop.js'
import { exportModule } from '../../../modules/export.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../shared/Spinner.jsx'
import { SpinnerOverlay } from '../../shared/SpinnerOverlay.jsx'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 86px);
  user-select: none !important;
`
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100% - 60px);
  width: 100%;
  > div:nth-of-type(2) {
    scrollbar-gutter: stable;
  }
`
export const StyledTableCell = styled.div`
  font-size: 0.75rem !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  padding: 2px 4px !important;
  padding-left: ${(props) =>
    props['data-firstchild'] ? '10px !important' : '2px'};
  border-left: solid hsla(70, 80%, 75%, 1) 1px;
  border-right: solid hsla(70, 80%, 75%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  box-sizing: border-box;
  background: ${(props) =>
    props['data-clicked'] ? 'rgb(255,211,167) !important'
    : props['data-isodd'] ? 'rgb(255, 255, 252)'
    : 'unset'};
  box-sizing: border-box;
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
  padding: 0 12px !important;
  font-size: unset !important;
  border-left: solid green 1px;
  border-right: solid green 1px;
  box-sizing: border-box;
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
  top: -20px;
`
const ExportButton = styled(Button)`
  position: absolute !important;
  top: 53px !important;
  right: 536px !important;
  min-width: 100px !important;
  text-transform: none !important;
  height: 2.2em;
  font-size: 0.75rem !important;
  right: 10px;
  padding: 2px 15px !important;
  line-height: unset !important;
  z-index: 5;
`

export const EkPlanTable = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const {
      aps,
      apValues,
      fields: fieldsShown,
      yearMenuAnchor,
      showEk,
      showEkf,
      showMassn,
      filterAp,
      filterPopNr,
      filterPopName,
      filterPopStatus,
      filterNr,
      filterGemeinde,
      filterFlurname,
      filterStatus,
      filterBekanntSeit,
      filterLv95X,
      filterLv95Y,
      filterEkfKontrolleur,
      filterEkfrequenzAbweichend,
      filterEkAbrechnungstyp,
      filterEkfrequenz,
      filterEkfrequenzStartjahr,
      filterEkfrequenzEmpty,
      filterEkfrequenzStartjahrEmpty,
      filterAnsiedlungYear,
      filterKontrolleYear,
      filterEkplanYear,
      pastYears,
    } = store.ekPlan

    const [processing, setProcessing] = useState(false)

    /**
     * BIG TROUBLE with height
     * ideally we would use flex with column and let css do the sizing
     * BUT: Chrome goes crazy when two columnal flexes are stacked
     * it keeps changing size by a fraction of a point permanently
     * which wrecks EVERYTHING as table rerenders permanently
     * So we need to:
     * 1. know appBarHeight
     * 2. NOT use columnal flex but boxes with calculated size
     */
    const {
      width = 0,
      height = 0,
      ref: resizeRef,
    } = useResizeDetector({
      refreshMode: 'debounce',
      refreshRate: 100,
      refreshOptions: { leading: true },
    })

    const tpopFilter = useMemo(() => {
      const tpopFilter = { popByPopId: { apId: { in: apValues } } }
      if (filterAp) {
        tpopFilter.apName = { includesInsensitive: filterAp }
      }
      if (filterPopNr) {
        tpopFilter.popByPopId.nr = { equalTo: filterPopNr }
      }
      if (filterPopName) {
        tpopFilter.popByPopId.name = { includesInsensitive: filterPopName }
      }
      if (filterPopStatus) {
        tpopFilter.popByPopId.popStatusWerteByStatus = {
          code: {
            in: filterPopStatus,
          },
        }
      }
      if (filterNr) {
        tpopFilter.nr = { equalTo: filterNr }
      }
      if (filterGemeinde) {
        tpopFilter.gemeinde = { includesInsensitive: filterGemeinde }
      }
      if (filterFlurname) {
        tpopFilter.flurname = { includesInsensitive: filterFlurname }
      }
      if (filterStatus?.length) {
        tpopFilter.popStatusWerteByStatus = {
          code: {
            in: filterStatus,
          },
        }
      }
      if (filterBekanntSeit) {
        tpopFilter.bekanntSeit = { equalTo: filterBekanntSeit }
      }
      if (filterLv95X) {
        tpopFilter.lv95X = { equalTo: filterLv95X }
      }
      if (filterLv95Y) {
        tpopFilter.lv95Y = { equalTo: filterLv95Y }
      }
      if (filterEkfKontrolleur) {
        tpopFilter.adresseByEkfKontrolleur = {
          name: { includesInsensitive: filterEkfKontrolleur },
        }
      }
      if (filterEkfrequenzAbweichend) {
        tpopFilter.ekfrequenzAbweichend = {
          equalTo: filterEkfrequenzAbweichend,
        }
      }
      if (filterEkAbrechnungstyp) {
        tpopFilter.ekfrequenzByEkfrequenz = {
          ekAbrechnungstyp: {
            includesInsensitive: filterEkAbrechnungstyp,
          },
        }
      }
      if (filterEkfrequenz) {
        tpopFilter.ekfrequenzByEkfrequenz = {
          code: {
            includesInsensitive: filterEkfrequenz,
          },
        }
      }
      if (filterEkfrequenzStartjahr) {
        tpopFilter.ekfrequenzStartjahr = { equalTo: filterEkfrequenzStartjahr }
      }
      if (filterEkfrequenzEmpty) {
        tpopFilter.ekfrequenz = { isNull: true }
      }
      if (filterEkfrequenzStartjahrEmpty) {
        tpopFilter.ekfrequenzStartjahr = { isNull: true }
      }
      if (filterKontrolleYear) {
        tpopFilter.tpopkontrsByTpopId = {
          some: { jahr: { equalTo: filterKontrolleYear } },
        }
      }
      if (filterAnsiedlungYear) {
        tpopFilter.tpopmassnsByTpopId = {
          some: {
            jahr: { equalTo: filterAnsiedlungYear },
            tpopmassnTypWerteByTyp: { ansiedlung: { equalTo: true } },
          },
        }
      }
      if (filterEkplanYear) {
        tpopFilter.ekplansByTpopId = {
          some: { jahr: { equalTo: filterEkplanYear } },
        }
      }
      return tpopFilter
    }, [
      apValues,
      filterAp,
      filterPopNr,
      filterPopName,
      filterPopStatus,
      filterNr,
      filterGemeinde,
      filterFlurname,
      filterStatus,
      filterBekanntSeit,
      filterLv95X,
      filterLv95Y,
      filterEkfKontrolleur,
      filterEkfrequenzAbweichend,
      filterEkAbrechnungstyp,
      filterEkfrequenz,
      filterEkfrequenzStartjahr,
      filterEkfrequenzEmpty,
      filterEkfrequenzStartjahrEmpty,
      filterAnsiedlungYear,
      filterKontrolleYear,
      filterEkplanYear,
    ])

    const { data, loading, error, refetch, networkStatus } = useQuery(
      queryAll,
      {
        variables: {
          tpopFilter,
          apIds: apValues,
        },
        notifyOnNetworkStatusChange: true,
      },
    )

    const ekfrequenzs = useMemo(
      () => data?.allEkfrequenzs?.nodes ?? [],
      [data?.allEkfrequenzs?.nodes],
    )
    const tpops = useMemo(
      () => data?.allTpops?.nodes ?? [],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [data?.allTpops?.nodes, tpopFilter, apValues],
    )
    const years = useMemo(
      () => yearsFromTpops({ tpops, pastYears }),
      [pastYears, tpops],
    )
    const yearRows = useMemo(
      () =>
        tpops.map((tpop, index) =>
          yearRowFromTpop({
            tpop,
            years,
            index,
          }),
        ),
      [tpops, years],
    )
    const yearColumns =
      yearRows.length ?
        sortBy(
          Object.values(yearRows[0])
            .filter((o) => typeof o === 'object')
            .filter((o) => !!o.value && !!o.value.eks)
            .filter((o) => !!o.name),
          'sort',
        )
      : []
    // tpopRows does not update when a single tpop changes if passed tpops
    // solution is to pass stringified version
    // Also: they need to update when the filter changes
    const tpopsStringified = JSON.stringify(tpops)
    const tpopRows = useMemo(
      () => tpops.map((tpop, index) => tpopRowFromTpop({ tpop, index })),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [tpops, tpopFilter, tpopsStringified, apValues],
    )
    const tpopColumns =
      tpopRows.length ?
        sortBy(
          Object.values(tpopRows[0])
            .filter((o) => typeof o === 'object')
            .filter((o) => !!o.name)
            .filter((o) => fieldsShown.includes(o.name) || !!o.alwaysShow),
          'sort',
        )
      : []
    const headerFieldsFixed = sortBy(
      Object.values(fields).filter(
        (o) => fieldsShown.includes(o.name) || !!o.alwaysShow,
      ),
      'sort',
    )
    let headerFieldsFixedWidth = sumBy(headerFieldsFixed, 'width')
    if (headerFieldsFixedWidth > width) {
      headerFieldsFixedWidth = width
    }

    const tpopGrid = useRef(null)
    const yearHeaderGrid = useRef(null)

    let headerYearFieldsWidth = width - headerFieldsFixedWidth
    if (headerYearFieldsWidth < 0) headerYearFieldsWidth = 0

    const showsLength = [showEk, showEkf, showMassn].filter((s) => !!s).length
    const rowHeight = 23 + (showsLength ? showsLength - 1 : 0) * 16

    /**
     * See https://github.com/bvaughn/react-window/issues/69
     * for sticky columns,
     * https://codesandbox.io/s/y3pyp85zm1
     * for sticky headers
     */
    const onScroll = ({ scrollTop, scrollLeft, scrollUpdateWasRequested }) => {
      if (!scrollUpdateWasRequested) {
        tpopGrid.current && tpopGrid.current.scrollTo({ scrollTop })
        yearHeaderGrid.current &&
          scrollLeft &&
          yearHeaderGrid.current.scrollTo({ scrollLeft })
      }
    }

    // when this value changes, year columns are re-rendered as it is added as key
    // needed because otherwise when changing filters column widths can be off
    const yearHeaderRerenderValue = useMemo(
      () =>
        JSON.stringify([
          filterAnsiedlungYear,
          filterKontrolleYear,
          filterEkplanYear,
        ]),
      [filterAnsiedlungYear, filterEkplanYear, filterKontrolleYear],
    )

    const onClickExport = useCallback(() => {
      const data = tpops.map((tpop) =>
        exportRowFromTpop({ tpop, years, store, ekfrequenzs }),
      )
      exportModule({
        data,
        fileName: 'ek-planung',
        store,
      })
    }, [tpops, store, years, ekfrequenzs])

    if (aps.length > 0 && networkStatus === 1) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        {processing && <SpinnerOverlay message="Daten werden verarbeitet" />}
        <ExportButton
          variant="outlined"
          onClick={onClickExport}
          color="inherit"
        >
          exportieren
        </ExportButton>
        <Container ref={resizeRef}>
          <HeaderContainer>
            <TpopTitle>{`${loading ? '...' : tpops.length} Teilpopulationen`}</TpopTitle>
            <VariableSizeList
              style={{ overflow: 'hidden' }}
              key={`${headerFieldsFixed.length}${fieldsShown.join()}`}
              height={60}
              itemCount={headerFieldsFixed.length}
              itemSize={(index) => headerFieldsFixed[index].width}
              layout="horizontal"
              width={headerFieldsFixedWidth}
            >
              {({ index, style }) => {
                const column = headerFieldsFixed[index]
                const field = column.name
                // Return specifically built components for columns with menu
                if (field === 'ekfrequenz') {
                  return (
                    <CellHeaderFixedEkfrequenz
                      style={style}
                      column={column}
                    />
                  )
                }
                if (field === 'ekfrequenzStartjahr') {
                  return (
                    <CellHeaderFixedEkfrequenzStartjahr
                      style={style}
                      column={column}
                    />
                  )
                }
                if (field === 'status') {
                  return (
                    <CellHeaderFixedTpopStatus
                      style={style}
                      column={column}
                      refetch={refetch}
                    />
                  )
                }
                if (field === 'popStatus') {
                  return (
                    <CellHeaderFixedTpopStatus
                      style={style}
                      column={column}
                      refetch={refetch}
                      type="pop"
                    />
                  )
                }
                return (
                  <CellHeaderFixed
                    style={style}
                    column={column}
                  />
                )
              }}
            </VariableSizeList>
            <VariableSizeGrid
              key={yearHeaderRerenderValue}
              style={{ overflow: 'hidden' }}
              ref={yearHeaderGrid}
              height={60}
              width={headerYearFieldsWidth}
              rowHeight={() => 60}
              columnCount={yearColumns.length}
              rowCount={1}
              columnWidth={() => yearColumnWidth}
            >
              {({ columnIndex, style }) => (
                <CellHeaderYear
                  style={style}
                  column={years[columnIndex]}
                  rows={tpopRows}
                />
              )}
            </VariableSizeGrid>
          </HeaderContainer>
          <BodyContainer>
            <VariableSizeGrid
              key={`${rowHeight}${fieldsShown.join()}`}
              ref={tpopGrid}
              style={{ overflowY: 'hidden' }}
              columnCount={tpopColumns.length}
              columnWidth={(index) => tpopColumns[index].width}
              height={height - 60}
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
                    <CellForValue
                      key={value.name}
                      field={value}
                      style={style}
                      row={row}
                      firstChild={columnIndex === 0}
                    />
                  )
                }
                if (value.name === 'ekfrequenz') {
                  return (
                    <CellForEkfrequenz
                      key={value.name}
                      row={row}
                      ekfrequenzs={ekfrequenzs}
                      field={value}
                      style={style}
                      refetchTpop={refetch}
                      setProcessing={setProcessing}
                    />
                  )
                }
                if (value.name === 'ekfrequenzStartjahr') {
                  return (
                    <CellForEkfrequenzStartjahr
                      key={value.name}
                      row={row}
                      style={style}
                      refetchTpop={refetch}
                      setProcessing={setProcessing}
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
                    firstChild={columnIndex === 0}
                  />
                )
              }}
            </VariableSizeGrid>
            <FixedSizeGrid
              columnCount={yearColumns.length}
              columnWidth={yearColumnWidth}
              height={height - 60}
              rowCount={yearRows.length}
              rowHeight={rowHeight}
              width={width - headerFieldsFixedWidth}
              onScroll={onScroll}
            >
              {({ columnIndex, rowIndex, style }) => {
                const row = yearRows[rowIndex]
                const column = yearColumns[columnIndex].name
                const value = row[column]

                return (
                  <CellForYear
                    row={row}
                    field={value}
                    style={style}
                  />
                )
              }}
            </FixedSizeGrid>
          </BodyContainer>
        </Container>
        {!!yearMenuAnchor && <CellForYearMenu />}
      </ErrorBoundary>
    )
  }),
)
