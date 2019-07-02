import React, { useState, useCallback, useMemo } from 'react'
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
import max from 'lodash/max'
import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import { observer } from 'mobx-react-lite'

import queryTpop from './queryTpop'
import queryLists from './queryLists'
//import storeContext from '../../storeContext'
import ApList from './ApList'
import appBaseUrl from '../../modules/appBaseUrl'
import SelectGrouped from './SelectGrouped'
import Select from './Select'
import Checkbox from './Checkbox'

const Container = styled.div`
  height: calc(100vh - 64px);
  width: 100%;
`
const Header = styled.div`
  padding: 5px 10px;
`
const StyledTable = styled(Table)`
  padding-left: 10px;
  padding-right: 10px;
`
const StyledTableHead = styled(TableHead)`
  background: rgba(128, 128, 128, 0.2) !important;
  height: 40px !important;
`
const StyledTableBody = styled(TableBody)`
  display: block !important;
  height: calc(100vh - 64px - 23px - 40px) !important;
  width: 100vw !important;
  overflow: auto !important;
`
const StyledTableHeaderRow = styled(TableRow)`
  position: relative !important;
  display: block !important;
  height: 40px !important;
`
const StyledTableHeaderCell = styled(TableCell)`
  width: ${props => `${props.width}px`};
  min-width: ${props => `${props.width}px`};
  max-width: ${props => `${props.width}px`};
  font-size: 0.75rem !important;
  color: black !important;
  padding: 2px 4px !important;
  line-height: 1rem !important;
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
const StyledTableCell = styled(TableCell)`
  width: ${props => `${props.width}px`};
  min-width: ${props => `${props.width}px`};
  max-width: ${props => `${props.width}px`};
  font-size: 0.75rem !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  padding: 2px 4px !important;
  &:first-child {
    padding-left: 10px !important;
  }
`
const TableCellForSelect = styled(StyledTableCell)`
  padding: 0 !important;
  font-size: unset !important;
  border-left: solid green 1px;
  border-right: solid green 1px;
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

const ektypRenamed = e => {
  switch (e.typ) {
    case 'Freiwilligen-Erfolgskontrolle':
      return 'EKF'
    case 'Zwischenbeurteilung':
      return 'EK'
    case 'Ausgangszustand':
      return 'AZ'
    default:
      return e.typ
  }
}

const yearsFromTpops = tpops => {
  const ekplans = tpops.flatMap(tpop => get(tpop, 'ekplansByTpopId.nodes'))
  const kontrs = tpops.flatMap(tpop => get(tpop, 'tpopkontrsByTpopId.nodes'))
  const firstEk = minBy([...ekplans, ...kontrs], 'jahr')
  // ensure never before 1993
  let firstYear = max([firstEk ? firstEk.jahr : 0, 1993])
  const currentYear = new Date().getFullYear()
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
      value: get(tpop, 'ekfrequenzAbweichend') || null,
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
          ek: kontrs.filter(o => o.jahr === year),
        },
        sort: year,
        width: 37,
      }),
  )
  return fields
}

const EkPlan = () => {
  //const store = useContext(storeContext)

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

  const {
    data: dataTpop,
    loading: loadingTpop,
    error: errorTpop,
    refetch: refetchTpop,
  } = useQuery(queryTpop, {
    variables: {
      aps: apValues,
    },
  })
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

  console.log('EkPlan rendering')

  return (
    <ErrorBoundary>
      <Container>
        <Header>
          <div>Das ist eine Baustelle - bitte noch nicht benutzen</div>
          <ApList aps={aps} removeAp={removeAp} addAp={addAp} />
          {aps.length > 0 && loadingTpop && 'Lade...'}
          {errorTpop && errorTpop.message}
        </Header>
        {rows.length > 0 && (
          <>
            <TpopTitle>{`${rows.length} Teilpopulationen`}</TpopTitle>
            <StyledTable size="small">
              <StyledTableHead>
                <StyledTableHeaderRow>
                  {fields.map(f => (
                    <StyledTableHeaderCell key={f.label} width={f.width}>
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
                          <StyledTableCell key={v.label} width={v.width}>
                            <OutsideLink
                              onClick={() => {
                                typeof window !== 'undefined' &&
                                  window.open(v.value)
                              }}
                              title="in neuem Tab öffnen"
                            >
                              <FaExternalLinkAlt />
                            </OutsideLink>
                          </StyledTableCell>
                        )
                      }
                      // DANGER: null is also an object!!
                      if (v.value && typeof v.value === 'object') {
                        return (
                          <StyledTableCell key={v.label} width={v.width}>
                            {v.value.ek.map(e => (
                              <div key={e.id}>{ektypRenamed(e)}</div>
                            ))}
                          </StyledTableCell>
                        )
                      }
                      return (
                        <StyledTableCell key={v.label} width={v.width}>
                          <div>{v.value}</div>
                        </StyledTableCell>
                      )
                    })}
                  </StyledTableRow>
                ))}
              </StyledTableBody>
            </StyledTable>
          </>
        )}
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
