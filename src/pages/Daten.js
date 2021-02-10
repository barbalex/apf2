import React, { useContext, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import isEqual from 'lodash/isEqual'

import Layout from '../components/Layout'
import storeContext from '../storeContext'
import Projekte from '../components/Projekte'
import User from '../components/User'
import Messages from '../components/Messages'
import Ekf from '../components/Ekf'
import Deletions from '../components/Deletions'
import EkPlan from '../components/EkPlan'
import Unterhalt from '../components/Unterhalt'
import ErrorBoundary from '../components/shared/ErrorBoundary'
import getActiveNodeArrayFromPathname from '../modules/getActiveNodeArrayFromPathname'

const Container = styled.div`
  background-color: #fffde7;
  height: 100%;

  @media print {
    margin-top: 0;
    height: auto;
    overflow: visible !important;
    background-color: white;
  }
`

const DatenPage = ({ location }) => {
  const store = useContext(storeContext)
  const { view, showDeletions, user, setIsPrint, setEkfIds } = store
  const { activeNodeArray, setActiveNodeArray, setLastTouchedNode } = store.tree

  useEffect(() => {
    // set last touched node in case project is directly opened on it
    setLastTouchedNode(getSnapshot(activeNodeArray))
  }, [activeNodeArray, setLastTouchedNode])

  // when pathname changes, update activeNodeArray
  // seems no more needed?
  const { pathname } = location
  useEffect(() => {
    const newAna = getActiveNodeArrayFromPathname(pathname)
    if (!isEqual(newAna, activeNodeArray.slice())) {
      // user pushed back button > update activeNodeArray
      setActiveNodeArray(newAna, 'nonavigate')
    }
  }, [activeNodeArray, pathname, setActiveNodeArray])

  /**
   * In Firefox this does not work! Bug is open since 7 years:
   * see: https://bugzilla.mozilla.org/show_bug.cgi?id=774398
   */
  useEffect(() => {
    window.matchMedia('print').addListener((mql) => {
      setIsPrint(mql.matches)
      if (!mql.matches) setEkfIds([])
    })
    return () => {
      window.matchMedia('print').removeListener((mql) => {
        setIsPrint(mql.matches)
      })
    }
  }, [setEkfIds, setIsPrint])
  const isEkPlan =
    activeNodeArray.length === 3 &&
    activeNodeArray[0] === 'Projekte' &&
    activeNodeArray[2] === 'EK-Planung'

  const form = useMemo(
    () => (isEkPlan ? 'ekplan' : view === 'ekf' ? 'ekf' : 'projekte'),
    [isEkPlan, view],
  )

  const unterhalt = false
  if (unterhalt) {
    return (
      <Layout>
        <Unterhalt />
      </Layout>
    )
  }

  return (
    <ErrorBoundary>
      <Layout>
        <Container>
          {!!user.token && (
            <>
              {form === 'ekf' && <Ekf />}
              {form === 'projekte' && <Projekte />}
              {form === 'ekplan' && <EkPlan />}
              <Messages />
              {showDeletions && <Deletions />}
            </>
          )}
          <User />
        </Container>
      </Layout>
    </ErrorBoundary>
  )
}

export default observer(DatenPage)
