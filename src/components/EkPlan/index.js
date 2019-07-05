import React, { useState, useCallback, useRef } from 'react'
import styled from 'styled-components'
import ErrorBoundary from 'react-error-boundary'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
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
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
`
const ChooseContainer = styled.div``

const EkPlan = () => {
  const headerRef = useRef(null)

  const [showEk, setShowEk] = useState(true)
  const [showEkf, setShowEkf] = useState(true)
  const [showCount, setShowCount] = useState(true)
  const [showEkCount, setShowEkCount] = useState(true)
  const [showMassn, setShowMassn] = useState(true)

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
          <ChooseContainer>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showEk}
                  onChange={() => console.log('TODO')}
                />
              }
              label="EK anzeigen"
              labelPlacement="start"
            />
          </ChooseContainer>
        </Header>
        <Table aps={aps} einheitsByAp={einheitsByAp} />
      </Container>
    </ErrorBoundary>
  )
}

export default observer(EkPlan)
