import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'

import ApList from './ApList'
import Table from './Table'
import Choose from './Choose'
import queryAps from './queryAps'
import storeContext from '../../storeContext'
import appBaseUrl from '../../modules/appBaseUrl'
import Error from '../shared/Error'
import ErrorBoundary from '../shared/ErrorBoundary'

const Container = styled.div`
  height: calc(100vh - 64px);
  width: 100vw;
  display: flex;
  flex-direction: column;
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
  top: 30px;
  right: 115px;
  padding: 2px 15px !important;
  line-height: unset !important;
`

const EkPlan = () => {
  const store = useContext(storeContext)
  const { aps, setApsData, setApsDataLoading } = store.ekPlan

  const { data, loading, error } = useQuery(queryAps, {
    variables: {
      ids: aps.map((ap) => ap.value),
    },
  })
  setApsData(data)
  setApsDataLoading(loading)

  const onClickAnleitung = useCallback(() => {
    const url = `${appBaseUrl()}Dokumentation/Benutzer/Erfolgs-Kontrollen-planen`
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return window.open(url, '_blank', 'toolbar=no')
      }
      window.open(url)
    }
  }, [])

  if (error) {
    const errors = [error]
    //console.log('EkPlan, error:', error.message)
    return <Error errors={errors} />
  }

  return (
    <ErrorBoundary>
      <Container>
        <Header>
          <ApList />
          <AnleitungButton variant="outlined" onClick={onClickAnleitung}>
            Anleitung
          </AnleitungButton>
          <Choose />
        </Header>
        <Table />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
