// @flow
import React, { lazy, Suspense, useState, useEffect } from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import get from 'lodash/get'
import { withApollo } from 'react-apollo'

import ErrorBoundary from '../shared/ErrorBoundary'
import setIsPrint from './setIsPrint'
import appContainerData from './data'
import Deletions from '../Deletions'
import Fallback from '../shared/Fallback'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  @media print {
    height: auto !important;
    display: block;
  }
`

const AppBar = lazy(() => import('../AppBar'))
const Projekte = lazy(() => import('../Projekte'))
const User = lazy(() => import('../User'))
const Errors = lazy(() => import('../Errors'))
const UpdateAvailable = lazy(() => import('../UpdateAvailable'))
const Messages = lazy(() => import('../Messages'))
const Ekf = lazy(() => import('../Ekf'))

const enhance = compose(
  withApollo,
  appContainerData,
)

const MyAppBar = ({ data, client }: { data: Object, client: Object }) => {
  const [showDeletions, setShowDeletions] = useState(false)

  useEffect(() => {
    window.matchMedia('print').addListener(mql => {
      if (mql.matches) {
        client.mutate({
          mutation: setIsPrint,
          variables: { value: true },
        })
      } else {
        client.mutate({
          mutation: setIsPrint,
          variables: { value: false },
        })
      }
      return () => window.matchMedia('print').removeListener()
    })
  }, [])

  const view = get(data, 'view')

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

export default enhance(MyAppBar)
