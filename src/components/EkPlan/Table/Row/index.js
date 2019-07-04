import React, { useState, useCallback, useMemo } from 'react'
import { useQuery } from 'react-apollo-hooks'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { FaExternalLinkAlt } from 'react-icons/fa'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import { observer } from 'mobx-react-lite'
import { GoArrowRight } from 'react-icons/go'
// this will be for Massnahmen
import { GiSpade } from 'react-icons/gi'
import { GoZap } from 'react-icons/go'

import queryLists from './queryLists'
import SelectGrouped from './SelectGrouped'
import Select from './Select'
import Checkbox from './Checkbox'
import EkfIcon from '../../../../icons/Ekf'
import EkIcon from '../../../../icons/Ek'

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
const EkTableCell = styled(TableCell)`
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
const TableCellForSelect = styled(EkTableCell)`
  padding: 0 !important;
  font-size: unset !important;
  border-left: solid green 1px;
  border-right: solid green 1px;
  &:focus-within {
    border: solid orange 3px;
  }
`
const TableCellForYear = styled(EkTableCell)`
  &:focus-within {
    border: solid orange 3px;
  }
`
const OutsideLink = styled.div`
  margin-left: 8px;
  margin-bottom: -2px;
  cursor: pointer;
  svg {
    font-size: 0.9em;
    color: rgba(0, 0, 0, 0.77);
  }
`
const AzContainer = styled.div`
  display: flex;
  height: 25px;
`
const AzIcon = styled(GoArrowRight)`
  font-size: 1.5rem;
`
const NrOfEvents = styled.span`
  bottom: 12px;
  left: -2px;
  position: relative;
`
const YearCellMenuTitle = styled.h5`
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  color: grey;
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
        v => !!v,
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

  return (
    <ErrorBoundary>
      <>
        <StyledTableRow key={row.id}>
          {sortBy(
            Object.values(row)
              .filter(o => typeof o === 'object')
              .filter(o => !!o.label),
            'sort',
          ).map(v => {
            if (v.label === 'EK Abrechnung Typ') {
              return (
                <TableCellForSelect
                  key={v.label}
                  width={v.width}
                  onMouseEnter={() => setColumnHovered(v.label)}
                  onMouseLeave={resetYearHovered}
                  data-columnishovered={columnHovered === v.label}
                  data-left={scrollPositions[v.name]}
                >
                  <Select
                    options={get(
                      dataLists,
                      'allEkAbrechnungstypWertes.nodes',
                      [],
                    )}
                    row={row}
                    val={v}
                    field="ekAbrechnungstyp"
                  />
                </TableCellForSelect>
              )
            }
            if (v.label === 'EK Frequenz') {
              return (
                <TableCellForSelect
                  key={v.label}
                  width={v.width}
                  onMouseEnter={() => setColumnHovered(v.label)}
                  onMouseLeave={resetYearHovered}
                  data-columnishovered={columnHovered === v.label}
                  data-left={scrollPositions[v.name]}
                >
                  <SelectGrouped
                    optionsGrouped={ekfOptionsGroupedPerAp[row.apId]}
                    row={row}
                    val={v}
                    field="ekfrequenz"
                  />
                </TableCellForSelect>
              )
            }
            if (v.label === 'EK Frequenz abweichend') {
              return (
                <TableCellForSelect
                  key={v.label}
                  width={v.width}
                  onMouseEnter={() => setColumnHovered(v.label)}
                  onMouseLeave={resetYearHovered}
                  data-columnishovered={columnHovered === v.label}
                  data-left={scrollPositions[v.name]}
                >
                  <Checkbox
                    row={row.tpop}
                    value={v.value}
                    field="ekfrequenzAbweichend"
                  />
                </TableCellForSelect>
              )
            }
            if (v.label === 'Link') {
              return (
                <EkTableCell
                  key={v.label}
                  width={v.width}
                  onMouseEnter={() => setColumnHovered(v.label)}
                  onMouseLeave={resetYearHovered}
                  data-columnishovered={columnHovered === v.label}
                  data-left={scrollPositions[v.name]}
                >
                  <OutsideLink
                    onClick={() => {
                      typeof window !== 'undefined' && window.open(v.value)
                    }}
                    title="in neuem Tab öffnen"
                  >
                    <FaExternalLinkAlt />
                  </OutsideLink>
                </EkTableCell>
              )
            }
            // DANGER: null is also an object!!
            if (v.value && typeof v.value === 'object') {
              return (
                <TableCellForYear
                  key={v.label}
                  width={v.width}
                  onMouseEnter={() => setColumnHovered(v.label)}
                  onMouseLeave={resetYearHovered}
                  data-columnishovered={columnHovered === v.label}
                  onClick={event => {
                    setLastClickedYearCell({
                      year: v.label,
                      tpopId: row.id,
                      tpop: `${row.ap.value} Pop: ${row.popNr.value}, TPop: ${row.tpopNr.value}`,
                      ekPlan: !!v.value.ek.length,
                      ekfPlan: !!v.value.ekf.length,
                    })
                    const currentTarget = event.currentTarget
                    setTimeout(() => setYearMenuAnchor(currentTarget))
                  }}
                >
                  <>
                    {!!v.value.az.length && (
                      <AzContainer>
                        <AzIcon
                          title="Ausgangszustand"
                          aria-label="Ausgangszustand"
                        />
                        {v.value.az.length > 1 && (
                          <NrOfEvents>{v.value.az.length}</NrOfEvents>
                        )}
                      </AzContainer>
                    )}
                    {!!v.value.ek.length && (
                      <div title="EK" aria-label="EK">
                        <EkIcon width="25px" height="20px" />
                        {v.value.ek.length > 1 && (
                          <NrOfEvents>{v.value.ek.length}</NrOfEvents>
                        )}
                      </div>
                    )}
                    {!!v.value.ekf.length && (
                      <div title="EKF" aria-label="EKF">
                        <EkfIcon width="25px" height="20px" />
                        {v.value.ekf.length > 1 && (
                          <NrOfEvents>{v.value.ekf.length}</NrOfEvents>
                        )}
                      </div>
                    )}
                  </>
                </TableCellForYear>
              )
            }
            return (
              <EkTableCell
                key={v.label}
                width={v.width}
                onMouseEnter={() => setColumnHovered(v.label)}
                onMouseLeave={resetYearHovered}
                data-columnishovered={columnHovered === v.label}
                data-left={scrollPositions[v.name]}
              >
                <div>{v.value}</div>
              </EkTableCell>
            )
          })}
        </StyledTableRow>
        <Menu
          id="yearCellMenu"
          anchorEl={yearMenuAnchor}
          keepMounted
          open={Boolean(yearMenuAnchor)}
          onClose={closeYearCellMenu}
        >
          <YearCellMenuTitle>{`${lastClickedYearCell.tpop}, ${lastClickedYearCell.year}`}</YearCellMenuTitle>
          {lastClickedYearCell.ekPlan ? (
            <MenuItem
              onClick={() => {
                console.log('TODO')
                closeYearCellMenu()
              }}
            >
              EK-Planung entfernen
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                console.log('TODO')
                closeYearCellMenu()
              }}
            >
              EK planen
            </MenuItem>
          )}
          {lastClickedYearCell.ekfPlan ? (
            <MenuItem
              onClick={() => {
                console.log('TODO')
                closeYearCellMenu()
              }}
            >
              EKF-Planung entfernen
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                console.log('TODO')
                closeYearCellMenu()
              }}
            >
              EKF planen
            </MenuItem>
          )}
        </Menu>
      </>
    </ErrorBoundary>
  )
}

export default observer(EkPlanTableRow)
