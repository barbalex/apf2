import { useContext, useState, Suspense } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import { useResizeDetector } from 'react-resize-detector'

import { MobxContext } from '../../../mobxContext.js'
import { queryAll } from './queryAll.js'
import { queryForExport } from './queryForExport.js'
import { CellForYearMenu } from './CellForYearMenu/index.jsx'
import { getYears } from './getYears.js'
import { Error } from '../../shared/Error.jsx'
import { exportRowFromTpop } from './exportRowFromTpop.js'
import { exportModule } from '../../../modules/export.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../shared/Spinner.jsx'
import { SpinnerOverlay } from '../../shared/SpinnerOverlay.jsx'
import { TpopRow } from './Row/index.jsx'
import { EkplanTableHeader } from './Header.jsx'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 86px);
  user-select: none !important;
  display: flex;
  flex-direction: column;
`
const YScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  scrollbar-gutter: stable;
`
// not in use
// Setting overflow-y: auto on the body did not work
// as the columns not initially visible would not be rendered
const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
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
  box-sizing: border-box;
  height: 60px;
  &.tpop-hovered {
    background-color: hsla(45, 100%, 90%, 1) !important;
  }
  &.column-hovered {
    background-color: hsla(45, 100%, 90%, 1) !important;
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
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem !important;
  cursor: pointer;
  &:focus-within {
    border: solid orange 3px;
  }
`
export const InfoRow = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  height: 19px;
  min-height: 19px;
  display: flex;
  align-items: center;
`
const ExportButton = styled(Button)`
  position: absolute !important;
  top: 53px !important;
  right: 517px !important;
  min-width: 9em !important;
  text-transform: none !important;
  height: 2em;
  font-size: 0.75rem !important;
  right: 10px;
  padding: 2px 15px !important;
  line-height: unset !important;
  z-index: 5;
`

const getTpopFilter = ({
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
}) => {
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
}

export const EkPlanTable = observer(() => {
  const apolloClient = useApolloClient()
  const store = useContext(MobxContext)
  const {
    aps,
    apValues,
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

  const tpopFilter = getTpopFilter({
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
  })

  const { data, error, refetch } = useQuery({
    queryKey: ['EkplanTpopQuery', tpopFilter],
    queryFn: () =>
      apolloClient.query({
        query: queryAll,
        variables: { tpopFilter },
        fetchPolicy: 'no-cache',
      }),
  })

  const tpops = data?.data?.allTpops?.nodes ?? []
  const years = getYears(store.ekPlan.pastYears)

  // when this value changes, year columns are re-rendered as it is added as key
  // needed because otherwise when changing filters column widths can be off
  const yearHeaderRerenderValue = JSON.stringify([
    filterAnsiedlungYear,
    filterKontrolleYear,
    filterEkplanYear,
  ])

  const onClickExport = async () => {
    let result
    try {
      result = await apolloClient.query({
        query: queryForExport,
        variables: { tpopFilter, apIds: apValues },
      })
    } catch (error) {
      return enqueNotification({
        message: `Fehler beim Abfragen für den Export: ${error.message}`,
        options: {
          variant: 'error',
        },
      })
    }
    const tpops = result?.data?.allTpops?.nodes ?? []
    const ekfrequenzs = result?.data?.allEkfrequenzs?.nodes ?? []
    const data = tpops.map((tpop) =>
      exportRowFromTpop({ tpop, years, store, ekfrequenzs }),
    )
    exportModule({
      data,
      fileName: 'ek-planung',
      store,
      apolloClient,
    })
  }

  // TODO: give button to remove all filters in case something goes wrong

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      {processing && (
        <SpinnerOverlay message="Startjahr und EK-Pläne werden gesetzt" />
      )}
      <Suspense fallback={<Spinner />}>
        <ExportButton
          variant="outlined"
          onClick={onClickExport}
          color="inherit"
        >
          exportieren
        </ExportButton>
        <Container ref={resizeRef}>
          <YScrollContainer>
            <EkplanTableHeader
              tpopLength={tpops.length !== 0 ? tpops.length : '...'}
              tpopFilter={tpopFilter}
              refetch={refetch}
              years={years}
            />
            {tpops.map((tpop, index) => (
              <TpopRow
                key={tpop.id}
                tpopId={tpop.id}
                index={index}
                setProcessing={setProcessing}
                years={years}
              />
            ))}
          </YScrollContainer>
        </Container>
      </Suspense>
      {!!yearMenuAnchor && <CellForYearMenu />}
    </ErrorBoundary>
  )
})
