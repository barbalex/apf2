import React, { useContext, useCallback } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/client'
import Button from '@mui/material/Button'

import ApList from './ApList'
import Table from './Table'
import Choose from './Choose'
import queryAps from './queryAps'
import storeContext from '../../storeContext'
import appBaseUrl from '../../modules/appBaseUrl'
import Error from '../shared/Error'
import ErrorBoundary from '../shared/ErrorBoundary'
import User from '../User'

const Container = styled.div`
  height: 100%;
  width: 100vw;
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
  const store = useContext(storeContext)
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

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Container>
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
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
