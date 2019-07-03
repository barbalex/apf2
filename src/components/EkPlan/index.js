import React, { useState, useCallback, useMemo, useRef } from 'react'
import { useQuery } from 'react-apollo-hooks'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { FaExternalLinkAlt } from 'react-icons/fa'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import get from 'lodash/get'
import minBy from 'lodash/minBy'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import { observer } from 'mobx-react-lite'
import { GoArrowRight } from 'react-icons/go'
// this will be for Massnahmen
import { GiSpade } from 'react-icons/gi'
import { GoZap } from 'react-icons/go'

import queryTpop from './queryTpop'
import queryLists from './queryLists'
//import storeContext from '../../storeContext'
import ApList from './ApList'
import appBaseUrl from '../../modules/appBaseUrl'
import SelectGrouped from './SelectGrouped'
import Select from './Select'
import Checkbox from './Checkbox'
import EkfIcon from '../../icons/Ekf'
import EkIcon from '../../icons/Ek'

const Container = styled.div`
  height: calc(100vh - 64px);
  width: 100vw;
`
const Header = styled.div`
  padding: 5px 10px;
`
const TableContainer = styled.div`
  position: relative;
  overflow-x: auto;
  width: 100vw;
  height: ${props =>
    `calc(100vh - 64px - ${props.headerheight}px - 17.6px) !important`};
`
const StyledTable = styled(Table)`
  position: relative;
  padding-left: 10px;
  padding-right: 10px;
  border-collapse: separate;
  border-spacing: 0;
`
const StyledTableHead = styled(TableHead)`
  display: block !important;
  background: #d9e8d9 !important;
  height: 50px !important;
  position: sticky;
  top: 0;
`
const StyledTableBody = styled(TableBody)`
  display: block !important;
  overflow-y: auto;
  height: ${props =>
    `calc(100vh - 64px - ${props.headerheight}px - 17.6px - 50px) !important`};
`
const StyledTableHeaderRow = styled(TableRow)`
  position: relative !important;
  display: block !important;
  height: 50px !important;
`
const StyledTableHeaderCell = styled(TableCell)`
  width: ${props => `${props.width}px`};
  min-width: ${props => `${props.width}px`};
  max-width: ${props => `${props.width}px`};
  font-weight: ${props =>
    props.yearishovered ? '800 !important' : '500 !important'};
  font-size: 0.75rem !important;
  color: black !important;
  padding: 2px 4px !important;
  line-height: 1rem !important;
  border-left: solid rgba(0, 0, 0, 0.1) 1px;
  border-right: solid rgba(0, 0, 0, 0.1) 1px;
  background: ${props =>
    props.yearishovered ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)'};
  &:first-child {
    padding-left: 10px !important;
  }
`
const StyledTableRow = styled(TableRow)`
  height: 100%;
  &:hover {
    background: rgba(255, 211, 167, 0.3) !important;
  }
  &:nth-of-type(odd) {
    background: #fefdf5;
  }
`
const EkTableCell = styled(TableCell)`
  width: ${props => `${props.width}px`};
  min-width: ${props => `${props.width}px`};
  max-width: ${props => `${props.width}px`};
  font-size: 0.75rem !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  padding: 2px 4px !important;
  border-left: solid rgba(0, 128, 0, 0.1) 1px;
  border-right: solid rgba(0, 128, 0, 0.1) 1px;
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
  border-left: solid rgba(0, 128, 0, 0.1) 1px;
  border-right: solid rgba(0, 128, 0, 0.1) 1px;
  background: ${props =>
    props.yearishovered ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)'};
  &:focus-within {
    border: solid orange 3px;
  }
`
const TpopTitle = styled.h4`
  margin: 0 10px 4px 10px;
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

const yearsFromTpops = tpops => {
  const ekplans = tpops.flatMap(tpop => get(tpop, 'ekplansByTpopId.nodes'))
  const kontrs = tpops.flatMap(tpop => get(tpop, 'tpopkontrsByTpopId.nodes'))
  const firstEk = minBy([...ekplans, ...kontrs], 'jahr')
  const currentYear = new Date().getFullYear()
  const firstEkYear = firstEk ? firstEk.jahr : null
  // ensure never before 1993
  let firstYear = firstEkYear || currentYear
  const lastYear = currentYear + 15
  const years = []
  while (firstYear <= lastYear) {
    years.push(firstYear++)
  }
  return years
}
const rowsFromTpop = ({ tpop, years }) => {
  const ekplans = get(tpop, 'ekplansByTpopId.nodes')
  const kontrs = get(tpop, 'tpopkontrsByTpopId.nodes')

  const fields = {
    id: tpop.id,
    tpop: tpop,
    apId: get(tpop, 'popByPopId.apByApId.id'),
    ap: {
      label: 'AP',
      value: get(tpop, 'popByPopId.apByApId.label'),
      sort: 1,
      width: 200,
    },
    popNr: {
      label: 'Pop Nr',
      value: get(tpop, 'popByPopId.nr') || '-',
      sort: 2,
      width: 40,
    },
    popName: {
      label: 'Pop Name',
      value: get(tpop, 'popByPopId.name') || '-',
      sort: 3,
      width: 200,
    },
    tpopNr: {
      label: 'Nr',
      value: get(tpop, 'nr') || '-',
      sort: 4,
      width: 50,
    },
    tpopGemeinde: {
      label: 'Gemeinde',
      value: get(tpop, 'gemeinde') || '-',
      sort: 5,
      width: 130,
    },
    tpopFlurname: {
      label: 'Flurname',
      value: get(tpop, 'flurname') || '-',
      sort: 6,
      width: 200,
    },
    tpopStatus: {
      label: 'Status',
      value: get(tpop, 'popStatusWerteByStatus.text') || '-',
      sort: 7,
      width: 150,
    },
    tpopBekanntSeit: {
      label: 'bekannt seit',
      value: get(tpop, 'bekanntSeit') || '-',
      sort: 8,
      width: 60,
    },
    tpopLink: {
      label: 'Link',
      value: `${appBaseUrl()}Daten/Projekte/${
        tpop.popByPopId.apByApId.projId
      }/Aktionspläne/${tpop.popByPopId.apByApId.id}/Populationen/${
        tpop.popByPopId.id
      }/Teil-Populationen/${tpop.id}`,
      sort: 9,
      width: 37,
    },
    ekAbrechnungstyp: {
      label: 'EK Abrechnung Typ',
      value: get(tpop, 'ekAbrechnungstyp'),
      sort: 9,
      width: 75,
    },
    ekfrequenz: {
      label: 'EK Frequenz',
      value: get(tpop, 'ekfrequenz') || null,
      sort: 10,
      width: 70,
    },
    ekfrequenzAbweichend: {
      label: 'EK Frequenz abweichend',
      value: get(tpop, 'ekfrequenzAbweichend') === true,
      sort: 11,
      width: 75,
    },
  }
  years.forEach(
    year =>
      (fields[year.toString()] = {
        label: year,
        value: {
          plan: ekplans.filter(o => o.jahr === year),
          az: kontrs
            .filter(o => o.jahr === year)
            .filter(o => o.typ === 'Ausgangszustand'),
          ek: kontrs
            .filter(o => o.jahr === year)
            .filter(o => o.typ === 'Zwischenbeurteilung'),
          ekf: kontrs
            .filter(o => o.jahr === year)
            .filter(o => o.typ === 'Freiwilligen-Erfolgskontrolle'),
        },
        sort: year,
        width: 38,
      }),
  )
  return fields
}

const EkPlan = () => {
  //const store = useContext(storeContext)
  const headerComponent = useRef(null)

  const [yearHovered, setYearHovered] = useState(null)
  const resetYearHovered = useCallback(() => setYearHovered(null), [])

  const [aps, setAps] = useState([])
  const apValues = useMemo(() => aps.map(a => a.value), [aps])
  const addAp = useCallback(
    ap => {
      setAps([...aps, ap])
    },
    [aps],
  )
  const removeAp = useCallback(
    ap => {
      setAps(aps.filter(a => a.value !== ap.value))
    },
    [aps],
  )

  const { data: dataTpop, loading: loadingTpop, error: errorTpop } = useQuery(
    queryTpop,
    {
      variables: {
        aps: apValues,
      },
    },
  )
  const tpops = sortBy(
    get(dataTpop, 'allTpops.nodes', []),
    t => t.popByPopId.apByApId.label,
  )
  const years = yearsFromTpops(tpops)
  const rows = tpops.map(tpop => rowsFromTpop({ tpop, years }))
  const fields = rows.length
    ? sortBy(
        Object.values(rows[0])
          .filter(o => typeof o === 'object')
          .filter(o => !!o.label),
        'sort',
      )
    : []

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

  const headerheight =
    headerComponent && headerComponent.current
      ? headerComponent.current.clientHeight
      : 0

  return (
    <ErrorBoundary>
      <Container>
        <Header ref={headerComponent}>
          <div>Das ist eine Baustelle - bitte noch nicht benutzen</div>
          <ApList aps={aps} removeAp={removeAp} addAp={addAp} />
          {aps.length > 0 && loadingTpop && 'Lade...'}
          {errorTpop && errorTpop.message}
        </Header>
        {rows.length > 0 && (
          <>
            <TpopTitle>{`${rows.length} Teilpopulationen`}</TpopTitle>
            <TableContainer headerheight={headerheight}>
              <StyledTable headerheight={headerheight} size="small">
                <StyledTableHead headerheight={headerheight}>
                  <StyledTableHeaderRow headerheight={headerheight}>
                    {fields.map(f => (
                      <StyledTableHeaderCell
                        key={f.label}
                        width={f.width}
                        yearishovered={yearHovered === f.label}
                        onMouseEnter={() =>
                          f.label > 1000 &&
                          f.label < 3000 &&
                          setYearHovered(f.label)
                        }
                        onMouseLeave={resetYearHovered}
                      >
                        {f.label}
                      </StyledTableHeaderCell>
                    ))}
                  </StyledTableHeaderRow>
                </StyledTableHead>
                <StyledTableBody>
                  {rows.map(r => (
                    <StyledTableRow key={r.id}>
                      {sortBy(
                        Object.values(r)
                          .filter(o => typeof o === 'object')
                          .filter(o => !!o.label),
                        'sort',
                      ).map(v => {
                        if (v.label === 'EK Abrechnung Typ') {
                          return (
                            <TableCellForSelect key={v.label} width={v.width}>
                              <Select
                                options={get(
                                  dataLists,
                                  'allEkAbrechnungstypWertes.nodes',
                                  [],
                                )}
                                row={r}
                                val={v}
                                field="ekAbrechnungstyp"
                              />
                            </TableCellForSelect>
                          )
                        }
                        if (v.label === 'EK Frequenz') {
                          return (
                            <TableCellForSelect key={v.label} width={v.width}>
                              <SelectGrouped
                                optionsGrouped={ekfOptionsGroupedPerAp[r.apId]}
                                row={r}
                                val={v}
                                field="ekfrequenz"
                              />
                            </TableCellForSelect>
                          )
                        }
                        if (v.label === 'EK Frequenz abweichend') {
                          return (
                            <TableCellForSelect key={v.label} width={v.width}>
                              <Checkbox
                                row={r.tpop}
                                value={v.value}
                                field="ekfrequenzAbweichend"
                              />
                            </TableCellForSelect>
                          )
                        }
                        if (v.label === 'Link') {
                          return (
                            <EkTableCell key={v.label} width={v.width}>
                              <OutsideLink
                                onClick={() => {
                                  typeof window !== 'undefined' &&
                                    window.open(v.value)
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
                              onMouseEnter={() => setYearHovered(v.label)}
                              onMouseLeave={resetYearHovered}
                              yearishovered={yearHovered === v.label}
                            >
                              <>
                                {!!v.value.az.length && (
                                  <AzContainer>
                                    <AzIcon
                                      title="Ausgangszustand"
                                      aria-label="Ausgangszustand"
                                    />
                                    {v.value.az.length > 1 && (
                                      <NrOfEvents>
                                        {v.value.az.length}
                                      </NrOfEvents>
                                    )}
                                  </AzContainer>
                                )}
                                {!!v.value.ek.length && (
                                  <div title="EK" aria-label="EK">
                                    <EkIcon width="25px" height="20px" />
                                    {v.value.ek.length > 1 && (
                                      <NrOfEvents>
                                        {v.value.ek.length}
                                      </NrOfEvents>
                                    )}
                                  </div>
                                )}
                                {!!v.value.ekf.length && (
                                  <div title="EKF" aria-label="EKF">
                                    <EkfIcon width="25px" height="20px" />
                                    {v.value.ekf.length > 1 && (
                                      <NrOfEvents>
                                        {v.value.ekf.length}
                                      </NrOfEvents>
                                    )}
                                  </div>
                                )}
                              </>
                            </TableCellForYear>
                          )
                        }
                        return (
                          <EkTableCell key={v.label} width={v.width}>
                            <div>{v.value}</div>
                          </EkTableCell>
                        )
                      })}
                    </StyledTableRow>
                  ))}
                </StyledTableBody>
              </StyledTable>
            </TableContainer>
          </>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
