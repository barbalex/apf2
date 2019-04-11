import React, { lazy, Suspense, useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from './shared/ErrorBoundary'
import Deletions from './Deletions'
import Fallback from './shared/Fallback'
import storeContext from '../storeContext'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  @media print {
    height: auto !important;
    display: block;
  }
`

const AppBar = lazy(() => import('./AppBar'))
const Projekte = lazy(() => import('./Projekte'))
const User = lazy(() => import('./User'))
const Errors = lazy(() => import('./Errors'))
const UpdateAvailable = lazy(() => import('./UpdateAvailable'))
const Messages = lazy(() => import('./Messages'))
const Ekf = lazy(() => import('./Ekf'))

const AppContainer = () => {
  const { setIsPrint, view } = useContext(storeContext)
  const [showDeletions, setShowDeletions] = useState(false)

  useEffect(() => {
    window.matchMedia('print').addListener(mql => {
      setIsPrint(mql.matches)
    })
    return () => window.matchMedia('print').removeListener()
  }, [])

  return (
    <ErrorBoundary>
      <Container>
        <Suspense fallback={<Fallback />}>
          <AppBar setShowDeletions={setShowDeletions} />
          {view === 'ekf' && <Ekf />}
          {view === 'normal' && <Projekte />}
          <User />
          <Errors />
          <UpdateAvailable />
          <Messages />
          {showDeletions && (
            <Deletions
              showDeletions={showDeletions}
              setShowDeletions={setShowDeletions}
            />
          )}
        </Suspense>
      </Container>
    </ErrorBoundary>
  )
}

export default observer(AppContainer)
