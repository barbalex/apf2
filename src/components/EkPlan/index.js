import React, { useState, useCallback, useRef } from 'react'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import { observer } from 'mobx-react-lite'
import { useQuery } from 'react-apollo-hooks'
import groupBy from 'lodash/groupBy'
import get from 'lodash/get'

import ApList from './ApList'
import Table from './Table'
import queryAps from './queryAps'

const Container = styled.div`
  height: calc(100vh - 64px);
  width: 100vw;
  display: flex;
  flex-direction: column;
`
const Header = styled.div`
  padding: 5px 10px;
`

const EkPlan = () => {
  const headerRef = useRef(null)

  const [aps, setAps] = useState([])
  const addAp = useCallback(
    ap => {
      setAps([...aps, ap])
    },
    [aps],
  )
  const removeAp = useCallback(
    ap => {
      setAps(aps.filter(a => a.value !== ap.value))
    },
    [aps],
  )
  const queryApsResult = useQuery(queryAps, {
    variables: {
      ids: aps.map(ap => ap.value),
    },
  })
  const einheitsByAp = groupBy(
    get(queryApsResult, 'data.allAps.nodes', []),
    'id',
  )
  Object.keys(einheitsByAp).forEach(
    apId =>
      (einheitsByAp[apId] = get(
        einheitsByAp[apId][0],
        'ekzaehleinheitsByApId.nodes',
        [],
      ).map(o => o.tpopkontrzaehlEinheitWerteByZaehleinheitId.code)),
  )

  return (
    <ErrorBoundary>
      <Container>
        <Header ref={headerRef}>
          <ApList
            aps={aps}
            removeAp={removeAp}
            addAp={addAp}
            queryApsResult={queryApsResult}
          />
        </Header>
        <Table aps={aps} einheitsByAp={einheitsByAp} />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
