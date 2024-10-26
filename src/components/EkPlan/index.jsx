import { useContext, useCallback, lazy, Suspense } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import Button from '@mui/material/Button'

const ApList = lazy(() => import('./ApList/index.jsx'))
const Table = lazy(() => import('./Table/index.jsx'))
const Choose = lazy(() => import('./Choose.jsx'))
import queryAps from './queryAps.js'
import { StoreContext } from '../../storeContext.js'
import appBaseUrl from '../../modules/appBaseUrl.js'
const Error = lazy(() => import('../shared/Error.jsx'))
import ErrorBoundary from '../shared/ErrorBoundary.jsx'
const User = lazy(() => import('../User.jsx'))
import Spinner from '../shared/Spinner.jsx'

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
const AnleitungButton = styled(Button)`
  text-transform: none !important;
  height: 2.2em;
  min-width: 100px !important;
  font-size: 0.75rem !important;
  padding: 2px 15px !important;
  margin-right: 30px;
  margin-top: 34px;
  line-height: unset !important;
`

const EkPlan = () => {
  const store = useContext(StoreContext)
  const { user } = store
  const { aps, setApsData, setApsDataLoading } = store.ekPlan

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
                <AnleitungButton
                  variant="outlined"
                  onClick={onClickAnleitung}
                  color="inherit"
                >
                  Anleitung
                </AnleitungButton>
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
}

export default observer(EkPlan)

export const Component = observer(EkPlan)

export const errorElement = ErrorBoundary
