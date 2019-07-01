import React, { useState, useCallback, useMemo } from 'react'
import { useQuery } from 'react-apollo-hooks'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import get from 'lodash/get'
import minBy from 'lodash/minBy'
import max from 'lodash/max'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'

import queryTpop from './queryTpop'
//import storeContext from '../../storeContext'
import ChooseAp from './ChooseAp'

const Container = styled.div`
  height: calc(100vh - 64px);
  width: 100%;
`
const StyledTable = styled(Table)`
  padding-left: 10px;
  padding-right: 10px;
  thead {
    background: rgba(128, 128, 128, 0.2);
    height: 40px;
  }
  thead > tr {
    position: relative;
    display: block;
    height: 40px;
  }
  thead tr th {
    font-size: 0.75rem;
    color: black;
    padding: 2px 4px;
    line-height: 1rem;
  }
  tbody {
    display: block;
    height: calc(100vh - 64px - 23px - 40px);
    width: 100vw;
    overflow: auto !important;
  }
  tbody tr td {
    font-size: 0.75rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    padding: 2px 4px;
  }
  tbody tr:nth-of-type(even) {
    background: rgba(128, 128, 128, 0.05);
  }
  th:first-child,
  td:first-child {
    padding-left: 10px;
  }
`
const StyledTableCell = styled(TableCell)`
  width: ${props => `${props.width}px`};
  min-width: ${props => `${props.width}px`};
  max-width: ${props => `${props.width}px`};
`
const StyledTableBody = styled(TableBody)``

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

  const [aps, setAps] = useState([
    { value: '6c52d174-4f62-11e7-aebe-67a303eb0640', label: 'Abies alba' },
  ])
  const apValues = useMemo(() => aps.map(a => a.value), [aps])
  const addAp = useCallback(
    ap => {
      setAps([...aps, ap])
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
  const tpops = sortBy(get(dataTpop, 'allTpops.nodes', []), t => [
    t.popByPopId.apByApId.label,
    t.popByPopId.nr,
    t.nr,
  ])
  const years = yearsFromTpops(tpops)
  const rows = tpops.map(tpop => rowsFromTpop({ tpop, years }))
  const fields = rows.length
    ? sortBy(Object.values(rows[0]).filter(o => typeof o === 'object'), 'sort')
    : []

  console.log('EkPlan', {
    tpops,
    rows,
    years,
    aps,
    fields,
  })

  return (
    <ErrorBoundary>
      <Container>
        <div>Hier ist was im Aufbau</div>
        <div>{`AP's: ${aps.map(a => a.label).join(', ')}`}</div>
        <ChooseAp addAp={addAp} apValues={apValues} />
        <StyledTable size="small">
          <TableHead>
            <TableRow>
              {fields.map(f => (
                <StyledTableCell key={f.label} width={f.width}>
                  {f.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <StyledTableBody>
            {aps.length === 0 ? (
              <TableRow>
                <TableCell>Bitte AP wählen</TableCell>
              </TableRow>
            ) : loadingTpop ? (
              <TableRow>
                <TableCell>Lade...</TableCell>
              </TableRow>
            ) : errorTpop ? (
              <TableRow>
                <TableCell>{errorTpop.message}</TableCell>
              </TableRow>
            ) : (
              rows.map(r => (
                <TableRow key={r.id}>
                  {sortBy(
                    Object.values(r).filter(o => typeof o === 'object'),
                    'sort',
                  ).map(v => (
                    <StyledTableCell key={v.label} width={v.width}>
                      {typeof v.value === 'object'
                        ? v.value.ek.map(e => (
                            <div key={e.id}>{ektypRenamed(e)}</div>
                          ))
                        : v.value}
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))
            )}
          </StyledTableBody>
        </StyledTable>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
