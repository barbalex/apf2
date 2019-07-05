import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useReducer,
} from 'react'
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
import appBaseUrl from '../../../modules/appBaseUrl'
import Row from './Row'
import CellForYearMenu from './Row/CellForYearMenu'

const Container = styled.div`
  padding: 10px;
`
const TableContainer = styled.div`
  position: relative;
  overflow: auto;
  width: 100vw;
  height: ${props => `calc(100vh - ${props['data-headtop']}px) !important`};
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
  background: hsla(120, 25%, 88%, 1) !important;
  height: 50px !important;
  position: sticky;
  top: 0;
  z-index: 2;
`
const StyledTableHeaderRow = styled(TableRow)`
  position: relative !important;
  display: block !important;
  height: 50px !important;
`
const StyledTableHeaderCell = styled(TableCell)`
  position: sticky;
  width: ${props => `${props.width}px`};
  min-width: ${props => `${props.width}px`};
  max-width: ${props => `${props.width}px`};
  font-weight: ${props =>
    props['data-columnishovered'] ? '800 !important' : '500 !important'};
  font-size: 0.75rem !important;
  color: black !important;
  padding: 2px 4px !important;
  line-height: 1rem !important;
  border-left: solid hsla(120, 25%, 70%, 1) 1px;
  border-right: solid hsla(120, 25%, 70%, 1) 1px;
  background: ${props =>
    props['data-columnishovered']
      ? 'hsla(120,25%,82%,1)'
      : 'hsla(120,25%,88%,1)'};
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
    props['data-clicked']
      ? 'rgb(255,211,167) !important'
      : props['data-columnishovered']
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
  margin: 0 10px 4px 10px;
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
      name: 'ap',
      label: 'AP',
      value: get(tpop, 'popByPopId.apByApId.label'),
      sort: 1,
      width: 200,
    },
    popNr: {
      name: 'popNr',
      label: 'Pop Nr',
      value: get(tpop, 'popByPopId.nr') || '-',
      sort: 2,
      width: 40,
    },
    popName: {
      name: 'popName',
      label: 'Pop Name',
      value: get(tpop, 'popByPopId.name') || '-',
      sort: 3,
      width: 200,
    },
    tpopNr: {
      name: 'nr',
      label: 'Nr',
      value: get(tpop, 'nr') || '-',
      sort: 4,
      width: 50,
    },
    tpopGemeinde: {
      name: 'gemeinde',
      label: 'Gemeinde',
      value: get(tpop, 'gemeinde') || '-',
      sort: 5,
      width: 130,
    },
    tpopFlurname: {
      name: 'flurname',
      label: 'Flurname',
      value: get(tpop, 'flurname') || '-',
      sort: 6,
      width: 200,
    },
    tpopStatus: {
      name: 'status',
      label: 'Status',
      value: get(tpop, 'popStatusWerteByStatus.text') || '-',
      sort: 7,
      width: 150,
    },
    tpopBekanntSeit: {
      name: 'bekanntSeit',
      label: 'bekannt seit',
      value: get(tpop, 'bekanntSeit') || '-',
      sort: 8,
      width: 60,
    },
    tpopLink: {
      name: 'link',
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
      name: 'ekAbrechnungstyp',
      label: 'EK Abrechnung Typ',
      value: get(tpop, 'ekAbrechnungstyp'),
      sort: 9,
      width: 80,
    },
    ekfrequenz: {
      name: 'ekfrequenz',
      label: 'EK Frequenz',
      value: get(tpop, 'ekfrequenz') || null,
      sort: 10,
      width: 70,
    },
    ekfrequenzAbweichend: {
      name: 'ekfrequenzAbweichend',
      label: 'EK Frequenz abweichend',
      value: get(tpop, 'ekfrequenzAbweichend') === true,
      sort: 11,
      width: 76,
    },
    yearTitle: {
      name: 'yearTitle',
      label: '',
      sort: 12,
      width: 40,
    },
  }
  years.forEach(
    year =>
      (fields[year.toString()] = {
        name: year,
        label: year,
        value: {
          ekPlan:
            ekplans.filter(o => o.jahr === year).filter(o => o.typ === 'EK')
              .length > 0,
          ekfPlan:
            ekplans.filter(o => o.jahr === year).filter(o => o.typ === 'EKF')
              .length > 0,
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

const initialYearClickedState = {
  year: null,
  tpopId: null,
  tpop: null,
  ekPlan: false,
  ekfPlan: false,
}
const yearClickedReducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return action.payload
    case 'reset':
      return initialYearClickedState
    default:
      throw new Error('no appropriate action found')
  }
}

const EkPlanTable = ({ aps }) => {
  //const store = useContext(storeContext)
  const headerRef = useRef(null)
  const apRef = useRef(null)
  const popNrRef = useRef(null)
  const popNameRef = useRef(null)
  const nrRef = useRef(null)
  const gemeindeRef = useRef(null)
  const flurnameRef = useRef(null)
  const statusRef = useRef(null)
  const bekanntSeitRef = useRef(null)
  const linkRef = useRef(null)
  const ekAbrechnungstypRef = useRef(null)
  const ekfrequenzRef = useRef(null)
  const ekfrequenzAbweichendRef = useRef(null)
  const yearTitleRef = useRef(null)
  const tableHeadRef = useRef(null)
  const refs = {
    ap: apRef,
    popNr: popNrRef,
    popName: popNameRef,
    nr: nrRef,
    gemeinde: gemeindeRef,
    flurname: flurnameRef,
    status: statusRef,
    bekanntSeit: bekanntSeitRef,
    link: linkRef,
    ekAbrechnungstyp: ekAbrechnungstypRef,
    ekfrequenz: ekfrequenzRef,
    ekfrequenzAbweichend: ekfrequenzAbweichendRef,
    yearTitle: yearTitleRef,
  }

  const [yearMenuAnchor, setYearMenuAnchor] = useState(null)
  const [yearClickedState, yearClickedDispatch] = useReducer(
    yearClickedReducer,
    initialYearClickedState,
  )
  const closeYearCellMenu = useCallback(event => {
    setYearMenuAnchor(null)
    yearClickedDispatch({ type: 'reset' })
  }, [])

  const [columnHovered, setColumnHovered] = useState(null)
  const resetYearHovered = useCallback(() => {
    if (!yearClickedState.year) setColumnHovered(null)
  }, [yearClickedState])

  const apValues = useMemo(() => aps.map(a => a.value), [aps])

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
  const years = yearsFromTpops(tpops)
  const rows = tpops.map(tpop => rowsFromTpop({ tpop, years }))
  const fields = rows.length
    ? sortBy(
        Object.values(rows[0])
          .filter(o => typeof o === 'object')
          .filter(o => !!o.name),
        'sort',
      )
    : []

  const tableHeadTop = tableHeadRef.current
    ? tableHeadRef.current.getBoundingClientRect().top
    : 163.6
  console.log('Table rendering:', { tableHeadTop })
  const scrollPositions = {
    ap: apRef.current ? apRef.current.getBoundingClientRect().left : 0,
    popNr: popNrRef.current ? popNrRef.current.getBoundingClientRect().left : 0,
    popName: popNameRef.current
      ? popNameRef.current.getBoundingClientRect().left
      : 0,
    nr: nrRef.current ? nrRef.current.getBoundingClientRect().left : 0,
    gemeinde: gemeindeRef.current
      ? gemeindeRef.current.getBoundingClientRect().left
      : 0,
    flurname: flurnameRef.current
      ? flurnameRef.current.getBoundingClientRect().left
      : 0,
    status: statusRef.current
      ? statusRef.current.getBoundingClientRect().left
      : 0,
    bekanntSeit: bekanntSeitRef.current
      ? bekanntSeitRef.current.getBoundingClientRect().left
      : 0,
    link: linkRef.current ? linkRef.current.getBoundingClientRect().left : 0,
    ekAbrechnungstyp: ekAbrechnungstypRef.current
      ? ekAbrechnungstypRef.current.getBoundingClientRect().left
      : 0,
    ekfrequenz: ekfrequenzRef.current
      ? ekfrequenzRef.current.getBoundingClientRect().left
      : 0,
    ekfrequenzAbweichend: ekfrequenzAbweichendRef.current
      ? ekfrequenzAbweichendRef.current.getBoundingClientRect().left
      : 0,
    yearTitle: yearTitleRef.current
      ? yearTitleRef.current.getBoundingClientRect().left
      : 0,
  }

  //console.log('Table rendering, yearClickedState:', yearClickedState)

  if (aps.length > 0 && loadingTpop) return <Container>Lade...</Container>
  if (errorTpop) return <Container>errorTpop.message</Container>
  return (
    <ErrorBoundary>
      <>
        {rows.length > 0 && (
          <>
            <TpopTitle>{`${rows.length} Teilpopulationen`}</TpopTitle>
            <TableContainer data-headtop={tableHeadTop}>
              <StyledTable size="small">
                <StyledTableHead ref={tableHeadRef}>
                  <StyledTableHeaderRow>
                    {fields.map(f => (
                      <StyledTableHeaderCell
                        key={f.name}
                        ref={refs[f.name] ? refs[f.name] : null}
                        width={f.width}
                        data-columnishovered={columnHovered === f.label}
                        onMouseEnter={() =>
                          f.label > 1000 &&
                          f.label < 3000 &&
                          setColumnHovered(f.label)
                        }
                        onMouseLeave={resetYearHovered}
                        data-left={scrollPositions[f.name]}
                      >
                        {f.label}
                      </StyledTableHeaderCell>
                    ))}
                  </StyledTableHeaderRow>
                </StyledTableHead>
                <StyledTableBody>
                  {rows.map(row => (
                    <Row
                      key={row.id}
                      aps={aps}
                      row={row}
                      columnHovered={columnHovered}
                      setColumnHovered={setColumnHovered}
                      resetYearHovered={resetYearHovered}
                      scrollPositions={scrollPositions}
                      yearClickedState={yearClickedState}
                      yearClickedDispatch={yearClickedDispatch}
                      yearMenuAnchor={yearMenuAnchor}
                      setYearMenuAnchor={setYearMenuAnchor}
                      closeYearCellMenu={closeYearCellMenu}
                    />
                  ))}
                </StyledTableBody>
              </StyledTable>
            </TableContainer>
          </>
        )}
        <CellForYearMenu
          yearMenuAnchor={yearMenuAnchor}
          yearClickedState={yearClickedState}
          closeYearCellMenu={closeYearCellMenu}
          refetch={refetch}
        />
      </>
    </ErrorBoundary>
  )
}

export default observer(EkPlanTable)
