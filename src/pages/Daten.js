import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../components/shared/ErrorBoundary'
import Layout from '../components/Layout'
import storeContext from '../storeContext'
import idbContext from '../idbContext'
import getActiveNodeArrayFromPathname from '../modules/getActiveNodeArrayFromPathname'
import setUserFromIdb from '../modules/setUserFromIdb'
import Projekte from '../components/Projekte'
import User from '../components/User'
import UpdateAvailable from '../components/UpdateAvailable'
import Messages from '../components/Messages'
import Ekf from '../components/Ekf'
import Deletions from '../components/Deletions'
import initiateDataFromUrl from '../modules/initiateDataFromUrl'

const Container = styled.div`
  height: calc(100vh - 64px);
  margin-top: 64px;
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
  const { idb } = useContext(idbContext)
  const { view, showDeletions, user } = store
  const { pathname } = location
  const { setActiveNodeArray } = store.tree
  useEffect(() => {
    // TODO:
    // is initiateDataFromUrl and setActiveNodeArray double?
    initiateDataFromUrl({
      store,
    })
    setUserFromIdb({ idb, store })
  }, [])
  const activeNodeArray = getActiveNodeArrayFromPathname(pathname)
  // when pathname changes, update activeNodeArray
  useEffect(() => {
    setActiveNodeArray(activeNodeArray)
  }, [pathname])

  return (
    <ErrorBoundary>
      <Layout>
        <Container>
          {!!user.token && (
            <>
              {view === 'ekf' && <Ekf />}
              {view === 'normal' && <Projekte />}
              <UpdateAvailable />
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
