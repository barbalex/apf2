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
import minBy from 'lodash/minBy'
import sortBy from 'lodash/sortBy'
import { observer } from 'mobx-react-lite'

import queryTpop from './queryTpop'
import queryLists from './queryLists'
import appBaseUrl from '../../../modules/appBaseUrl'
import Row from './Row'
import CellForYearMenu from './Row/CellForYearMenu'
import storeContext from '../../../storeContext'

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

export const fields = {
  ap: {
    name: 'ap',
    label: 'AP',
    sort: 1,
    width: 200,
  },
  popNr: {
    name: 'popNr',
    label: 'Pop Nr',
    sort: 2,
    width: 40,
  },
  popName: {
    name: 'popName',
    label: 'Pop Name',
    sort: 3,
    width: 200,
  },
  nr: {
    name: 'nr',
    label: 'Nr',
    sort: 4,
    width: 50,
  },
  gemeinde: {
    name: 'gemeinde',
    label: 'Gemeinde',
    sort: 5,
    width: 130,
  },
  flurname: {
    name: 'flurname',
    label: 'Flurname',
    sort: 6,
    width: 200,
  },
  status: {
    name: 'status',
    label: 'Status',
    sort: 7,
    width: 150,
  },
  bekanntSeit: {
    name: 'bekanntSeit',
    label: 'bekannt seit',
    sort: 8,
    width: 60,
  },
  link: {
    name: 'link',
    label: 'Link',
    sort: 9,
    width: 37,
  },
  ekAbrechnungstyp: {
    name: 'ekAbrechnungstyp',
    label: 'EK Abrechnung Typ',
    sort: 9,
    width: 80,
  },
  ekfrequenz: {
    name: 'ekfrequenz',
    label: 'EK Frequenz',
    sort: 10,
    width: 70,
  },
  ekfrequenzAbweichend: {
    name: 'ekfrequenzAbweichend',
    label: 'EK Frequenz abweichend',
    sort: 11,
    width: 76,
  },
  yearTitle: {
    name: 'yearTitle',
    label: '',
    sort: 12,
    width: 50,
    alwaysShow: true,
  },
}
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
const fieldsFromTpop = tpop => ({
  id: tpop.id,
  tpop: tpop,
  apId: get(tpop, 'popByPopId.apByApId.id'),
  ap: {
    ...fields.ap,
    value: get(tpop, 'popByPopId.apByApId.label'),
  },
  popNr: {
    ...fields.popNr,
    value: get(tpop, 'popByPopId.nr') || '-',
  },
  popName: {
    ...fields.popName,
    value: get(tpop, 'popByPopId.name') || '-',
  },
  nr: {
    ...fields.nr,
    value: get(tpop, 'nr') || '-',
  },
  gemeinde: {
    ...fields.gemeinde,
    value: get(tpop, 'gemeinde') || '-',
  },
  flurname: {
    ...fields.flurname,
    value: get(tpop, 'flurname') || '-',
  },
  status: {
    ...fields.status,
    value: get(tpop, 'popStatusWerteByStatus.text') || '-',
  },
  bekanntSeit: {
    ...fields.bekanntSeit,
    value: get(tpop, 'bekanntSeit') || '-',
  },
  link: {
    ...fields.link,
    value: `${appBaseUrl()}Daten/Projekte/${
      tpop.popByPopId.apByApId.projId
    }/Aktionspläne/${tpop.popByPopId.apByApId.id}/Populationen/${
      tpop.popByPopId.id
    }/Teil-Populationen/${tpop.id}`,
  },
  ekAbrechnungstyp: {
    ...fields.ekAbrechnungstyp,
    value: get(tpop, 'ekAbrechnungstyp'),
  },
  ekfrequenz: {
    ...fields.ekfrequenz,
    value: get(tpop, 'ekfrequenz') || null,
  },
  ekfrequenzAbweichend: {
    ...fields.ekfrequenzAbweichend,
    value: get(tpop, 'ekfrequenzAbweichend') === true,
  },
  yearTitle: fields.yearTitle,
})
const rowsFromTpop = ({ tpop, years, showCount }) => {
  const ekplans = get(tpop, 'ekplansByTpopId.nodes')
  const kontrs = get(tpop, 'tpopkontrsByTpopId.nodes')
  const ansiedlungs = get(tpop, 'tpopmassnsByTpopId.nodes')

  const fields = fieldsFromTpop(tpop)
  years.forEach(
    year =>
      (fields[year.toString()] = {
        name: year,
        label: year,
        alwaysShow: true,
        value: {
          ekPlan:
            ekplans.filter(o => o.jahr === year).filter(o => o.typ === 'EK')
              .length > 0,
          ekfPlan:
            ekplans.filter(o => o.jahr === year).filter(o => o.typ === 'EKF')
              .length > 0,
          ek: kontrs
            .filter(o => o.jahr === year)
            .filter(o => o.typ !== 'Freiwilligen-Erfolgskontrolle'),
          ekf: kontrs
            .filter(o => o.jahr === year)
            .filter(o => o.typ === 'Freiwilligen-Erfolgskontrolle'),
          ansiedlungs: ansiedlungs.filter(o => o.jahr === year),
        },
        sort: year,
        width: showCount ? 52 : 38,
      }),
  )
  return fields
}

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
        rowsFromTpop({
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

  console.log('Table rendering')

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
