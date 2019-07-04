import React, { useMemo, useCallback, useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import { observer } from 'mobx-react-lite'

import queryLists from './queryLists'
import CellForEkfrequenz from './CellForEkfrequenz'
import CellForEkAbrechnungstyp from './CellForEkAbrechnungstyp'
import CellForEkfrequenzAbweichend from './CellForEkfrequenzAbweichend'
import CellForTpopLink from './CellForTpopLink'
import CellForYear from './CellForYear'
import CellForYearMenu from './CellForYearMenu'

const StyledTableRow = styled(TableRow)`
  position: relative !important;
  display: block !important;
  height: 100%;
  &:hover td {
    background: hsla(45, 100%, 90%, 1) !important;
  }
  td {
    background: #fffde7;
  }
  &:nth-of-type(odd) td {
    background: #fffffc;
  }
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
    props['data-columnishovered']
      ? 'hsla(45, 100%, 90%, 1) !important'
      : 'unset'};
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
  border-left: ${props =>
    props['data-clicked']
      ? 'border: solid orange 3px;'
      : 'solid hsla(70, 80%, 75%, 1) 1px'};
  border-right: ${props =>
    props['data-clicked']
      ? 'border: solid orange 3px;'
      : 'solid hsla(70, 80%, 75%, 1) 1px'};
  border-top: ${props =>
    props['data-clicked'] ? 'border: solid orange 3px;' : 'unset'};
  border-bottom: ${props =>
    props['data-clicked'] ? 'border: solid orange 3px;' : 'unset'};
  &:focus-within {
    border: solid orange 3px;
  }
`

const EkPlanTableRow = ({
  aps,
  row,
  columnHovered,
  setColumnHovered,
  resetYearHovered,
  scrollPositions,
}) => {
  const [yearMenuAnchor, setYearMenuAnchor] = useState(null)
  const [lastClickedYearCell, setLastClickedYearCell] = useState({
    year: null,
    tpopId: null,
    tpop: null,
    ekPlan: false,
    ekfPlan: false,
  })
  const closeYearCellMenu = useCallback(event => {
    setYearMenuAnchor(null)
    setLastClickedYearCell({
      year: null,
      tpopId: null,
      tpop: null,
      ekPlan: false,
      ekfPlan: false,
    })
  }, [])

  const apValues = useMemo(() => aps.map(a => a.value), [aps])

  const { data: dataLists } = useQuery(queryLists, {
    variables: {
      apIds: apValues,
    },
  })

  const ekfrequenzOptions = get(dataLists, 'allEkfrequenzs.nodes', []).map(
    o => {
      const ekTypeArray = [o.ek ? 'ek' : null, o.ekf ? 'ekf' : null].filter(
        field => !!field,
      )
      const code = (o.code || '').padEnd(2)
      const anwendungsfall = (
        `${o.anwendungsfall}, ${ekTypeArray.join(' und ')}` || ''
      ).padEnd(26)
      const name = (o.name || '').padEnd(27)
      return {
        value: o.code,
        label: `${code}: ${name} | ${o.periodizitaet}`,
        anwendungsfall,
        apId: o.apId,
      }
    },
  )
  const ekfOptionsGroupedPerAp = groupBy(ekfrequenzOptions, 'apId')
  Object.keys(ekfOptionsGroupedPerAp).forEach(
    k =>
      (ekfOptionsGroupedPerAp[k] = groupBy(
        ekfOptionsGroupedPerAp[k],
        'anwendungsfall',
      )),
  )

  console.log('Row rendering')

  return (
    <ErrorBoundary>
      <>
        <StyledTableRow>
          {sortBy(
            Object.values(row)
              .filter(o => typeof o === 'object')
              .filter(o => !!o.label),
            'sort',
          ).map(field => {
            if (field.label === 'EK Abrechnung Typ') {
              return (
                <CellForEkAbrechnungstyp
                  key={field.label}
                  row={row}
                  field={field}
                  columnHovered={columnHovered}
                  setColumnHovered={setColumnHovered}
                  resetYearHovered={resetYearHovered}
                  scrollPositions={scrollPositions}
                  dataLists={dataLists}
                />
              )
            }
            if (field.label === 'EK Frequenz') {
              return (
                <CellForEkfrequenz
                  key={field.label}
                  row={row}
                  field={field}
                  columnHovered={columnHovered}
                  setColumnHovered={setColumnHovered}
                  resetYearHovered={resetYearHovered}
                  scrollPositions={scrollPositions}
                  ekfOptionsGroupedPerAp={ekfOptionsGroupedPerAp}
                />
              )
            }
            if (field.label === 'EK Frequenz abweichend') {
              return (
                <CellForEkfrequenzAbweichend
                  key={field.label}
                  row={row}
                  field={field}
                  columnHovered={columnHovered}
                  setColumnHovered={setColumnHovered}
                  resetYearHovered={resetYearHovered}
                  scrollPositions={scrollPositions}
                />
              )
            }
            if (field.label === 'Link') {
              return (
                <CellForTpopLink
                  key={field.label}
                  field={field}
                  columnHovered={columnHovered}
                  setColumnHovered={setColumnHovered}
                  resetYearHovered={resetYearHovered}
                  scrollPositions={scrollPositions}
                />
              )
            }
            // DANGER: null is also an object!!
            if (field.value && typeof field.value === 'object') {
              return (
                <CellForYear
                  key={field.label}
                  row={row}
                  field={field}
                  columnHovered={columnHovered}
                  setColumnHovered={setColumnHovered}
                  resetYearHovered={resetYearHovered}
                  scrollPositions={scrollPositions}
                  lastClickedYearCell={lastClickedYearCell}
                  setLastClickedYearCell={setLastClickedYearCell}
                  setYearMenuAnchor={setYearMenuAnchor}
                />
              )
            }
            return (
              <EkTableCell
                key={field.label}
                width={field.width}
                onMouseEnter={() => setColumnHovered(field.label)}
                onMouseLeave={resetYearHovered}
                data-columnishovered={columnHovered === field.label}
                data-left={scrollPositions[field.name]}
              >
                <div>{field.value}</div>
              </EkTableCell>
            )
          })}
        </StyledTableRow>
        <CellForYearMenu
          yearMenuAnchor={yearMenuAnchor}
          lastClickedYearCell={lastClickedYearCell}
          closeYearCellMenu={closeYearCellMenu}
        />
      </>
    </ErrorBoundary>
  )
}

export default observer(EkPlanTableRow)
