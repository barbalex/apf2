import React, { useRef, useContext, useMemo } from 'react'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'

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
  const { aps, fieldsShown } = store.ekPlan

  const headerRef = useRef(null)
  const headerBottom = headerRef.current
    ? headerRef.current.getBoundingClientRect().bottom
    : 150

  const queryApsResult = useQuery(queryAps, {
    variables: {
      ids: aps.map(ap => ap.value),
    },
  })
  const einheitsByAp = useMemo(() => {
    const e = groupBy(get(queryApsResult, 'data.allAps.nodes', []), 'id')
    Object.keys(e).forEach(
      apId =>
        (e[apId] = get(e[apId][0], 'ekzaehleinheitsByApId.nodes', []).map(
          o => o.tpopkontrzaehlEinheitWerteByZaehleinheitId.code,
        )),
    )
    return e
  }, [queryApsResult])

  console.log('EkPlan rendering, fieldsShown:', fieldsShown)

  return (
    <ErrorBoundary>
      <Container>
        <Header ref={headerRef}>
          <ApList queryApsResult={queryApsResult} />
          <Choose />
        </Header>
        <Table einheitsByAp={einheitsByAp} headerBottom={headerBottom} />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
