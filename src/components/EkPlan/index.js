import React, { useState, useCallback, useRef } from 'react'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import { observer } from 'mobx-react-lite'

import ApList from './ApList'
import Table from './Table'

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

  return (
    <ErrorBoundary>
      <Container>
        <Header ref={headerRef}>
          <ApList aps={aps} removeAp={removeAp} addAp={addAp} />
        </Header>
        <Table aps={aps} />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
