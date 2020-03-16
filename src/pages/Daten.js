import React, { useContext, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import Layout from '../components/Layout'
import storeContext from '../storeContext'
import Projekte from '../components/Projekte'
import User from '../components/User'
import Messages from '../components/Messages'
import Ekf from '../components/Ekf'
import Deletions from '../components/Deletions'
import EkPlan from '../components/EkPlan'

const Container = styled.div`
  background-color: #fffde7;
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
  const { activeNodeArray } = store.tree

  /**
   * In Firefox this does not work! Bug is open since 7 years:
   * see: https://bugzilla.mozilla.org/show_bug.cgi?id=774398
   */
  useEffect(() => {
    window.matchMedia('print').addListener(mql => {
      setIsPrint(mql.matches)
      if (!mql.matches) setEkfIds([])
    })
    return () => {
      window.matchMedia('print').removeListener(mql => {
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
