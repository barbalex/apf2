import { memo, useContext, useCallback, lazy, Suspense } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from "@apollo/client/react";
import Button from '@mui/material/Button'

const ApList = lazy(async () => ({
  default: (await import('./ApList/index.jsx')).ApList,
}))
const Table = lazy(async () => ({
  default: (await import('./Table/index.jsx')).EkPlanTable,
}))
const Choose = lazy(async () => ({
  default: (await import('./Choose.jsx')).Choose,
}))
import { queryAps } from './queryAps.js'
import { MobxContext } from '../../mobxContext.js'
import { appBaseUrl } from '../../modules/appBaseUrl.js'
const Error = lazy(async () => ({
  default: (await import('../shared/Error.jsx')).Error,
}))
const ErrorBoundary = lazy(async () => ({
  default: (await import('../shared/ErrorBoundary.jsx')).ErrorBoundary,
}))
const User = lazy(async () => ({ default: (await import('../User.jsx')).User }))
const Spinner = lazy(async () => ({
  default: (await import('../shared/Spinner.jsx')).Spinner,
}))

const Container = styled.div`
  height: 100%;
  width: 100vw;
  overflow: hidden;
`
const Header = styled.div`
  padding: 5px 10px 0 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 10px;
`
const AnleitungButton = styled(Button)`
  text-transform: none !important;
  height: 2em;
  min-width: 9em !important;
  font-size: 0.75rem !important;
  padding: 2px 15px !important;
  margin-left: -15px;
  margin-top: 28px;
  line-height: unset !important;
`
const FilterResetButton = styled(Button)`
  text-transform: none !important;
  height: 2em;
  min-width: 9em !important;
  font-size: 0.75rem !important;
  padding: 2px 5px !important;
  margin-left: -15px;
  margin-top: 3px;
  line-height: unset !important;
`

export const Component = memo(
  observer(() => {
    const store = useContext(MobxContext)
    const { user } = store
    const { aps, setApsData, setApsDataLoading } = store.ekPlan
    const {
      setFilterAp,
      setFilterPopNr,
      setFilterPopName,
      setFilterPopStatus,
      setFilterNr,
      setFilterGemeinde,
      setFilterFlurname,
      setFilterStatus,
      setFilterBekanntSeit,
      setFilterLv95X,
      setFilterLv95Y,
      setFilterEkfKontrolleur,
      setFilterEkfrequenzAbweichend,
      setFilterEkAbrechnungstyp,
      setFilterEkfrequenz,
      setFilterEkfrequenzStartjahr,
      setFilterAnsiedlungYear,
      setFilterKontrolleYear,
      setFilterEkplanYear,
    } = store.ekPlan

    const { data, loading, error } = useQuery(queryAps, {
      variables: {
        ids: aps.map((ap) => ap.value),
      },
    })
    setApsData(data)
    setApsDataLoading(loading)

    const onClickAnleitung = useCallback(() => {
      const url = `${appBaseUrl()}Dokumentation/erfolgs-kontrollen-planen`
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return window.open(url, '_blank', 'toolbar=no')
      }
      window.open(url)
    }, [])

    const onClickResetFilter = useCallback(() => {
      setFilterAp(null)
      setFilterPopNr(null)
      setFilterPopName(null)
      setFilterPopStatus([100, 101, 200, 201, 202, 300])
      setFilterNr(null)
      setFilterGemeinde(null)
      setFilterFlurname(null)
      setFilterStatus([100, 101, 200, 201, 202, 300])
      setFilterBekanntSeit(null)
      setFilterLv95X(null)
      setFilterLv95Y(null)
      setFilterEkfKontrolleur(null)
      setFilterEkfrequenzAbweichend(false)
      setFilterEkAbrechnungstyp(null)
      setFilterEkfrequenz(null)
      setFilterEkfrequenzStartjahr(null)
      setFilterAnsiedlungYear(null)
      setFilterKontrolleYear(null)
      setFilterEkplanYear(null)
    }, [])

    if (error) {
      return (
        <Suspense fallback={<Spinner />}>
          <Error error={error} />
        </Suspense>
      )
    }

    return (
      <ErrorBoundary>
        <Container>
          <Suspense fallback={<Spinner />}>
            {!!user.token && (
              <>
                <Header>
                  <ApList />
                  <ButtonContainer>
                    <AnleitungButton
                      variant="outlined"
                      onClick={onClickAnleitung}
                      color="inherit"
                    >
                      Anleitung
                    </AnleitungButton>
                    <FilterResetButton
                      variant="outlined"
                      onClick={onClickResetFilter}
                      color="inherit"
                    >
                      Filter leeren
                    </FilterResetButton>
                  </ButtonContainer>
                  <Choose />
                </Header>
                <Table />
              </>
            )}
            <User />
          </Suspense>
        </Container>
      </ErrorBoundary>
    )
  }),
)
