import React, { useContext, useCallback } from 'react'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'

import ApList from './ApList'
import Table from './Table'
import Choose from './Choose'
import queryAps from './queryAps'
import storeContext from '../../storeContext'
import appBaseUrl from '../../modules/appBaseUrl'

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
const StyledButton = styled(Button)`
  text-transform: none !important;
  height: 2.2em;
  top: 30px;
  font-size: 0.75rem !important;
  right: 10px;
  padding: 2px 15px !important;
  line-height: unset !important;
`

const EkPlan = () => {
  const store = useContext(storeContext)
  const { aps, setApsData, setApsDataLoading } = store.ekPlan

  const { data, loading } = useQuery(queryAps, {
    variables: {
      ids: aps.map(ap => ap.value),
    },
  })
  setApsData(data)
  setApsDataLoading(loading)

  const onClickAnleitung = useCallback(() => {
    const url = `${appBaseUrl()}Dokumentation/Benutzer/Erfolgs-Kontrollen-planen`
    typeof window !== 'undefined' && window.open(url)
  }, [])

  return (
    <ErrorBoundary>
      <>
        <Container>
          <Header>
            <ApList />
            <StyledButton variant="outlined" onClick={onClickAnleitung}>
              Anleitung
            </StyledButton>
            <Choose />
          </Header>

          <Table />
        </Container>
      </>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
