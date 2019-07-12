import React, { useContext } from 'react'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'

import ApList from './ApList'
import Table from './Table'
import Choose from './Choose'
import queryAps from './queryAps'
import storeContext from '../../storeContext'

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

  return (
    <ErrorBoundary>
      <Container>
        <Header>
          <ApList />
          <Choose />
        </Header>

        <Table />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
