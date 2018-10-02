// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import Loadable from 'react-loadable'
import withLifecycle from '@hocs/with-lifecycle'
import app from 'ampersand-app'
import get from 'lodash/get'

import ErrorBoundary from '../shared/ErrorBoundary'
import Loading from '../shared/Loading'
import setIsPrint from './setIsPrint'
import appContainerData from './data'
import Deletions from '../Deletions'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  @media print {
    height: auto !important;
    display: block;
  }
`

const AppBar = Loadable({
  loader: () => import('../AppBar'),
  loading: Loading,
})
const Projekte = Loadable({
  loader: () => import('../Projekte'),
  loading: Loading,
})
const User = Loadable({
  loader: () => import('../User'),
  loading: Loading,
})
const Errors = Loadable({
  loader: () => import('../Errors'),
  loading: Loading,
})
const UpdateAvailable = Loadable({
  loader: () => import('../UpdateAvailable'),
  loading: Loading,
})
const Messages = Loadable({
  loader: () => import('../Messages'),
  loading: Loading,
})
const Ekf = Loadable({
  loader: () => import('../Ekf'),
  loading: Loading,
})

const enhance = compose(
  withState('showDeletions', 'setShowDeletions', false),
  appContainerData,
  withLifecycle({
    onDidMount(prevProps, props) {
      window.matchMedia('print').addListener(mql => {
        if (mql.matches) {
          app.client.mutate({
            mutation: setIsPrint,
            variables: { value: true },
          })
        } else {
          app.client.mutate({
            mutation: setIsPrint,
            variables: { value: false },
          })
        }
      })
    },
    onWillUnmount() {
      window.matchMedia('print').removeListener()
    },
  }),
)

const MyAppBar = ({
  showDeletions,
  setShowDeletions,
  data,
}: {
  showDeletions: Boolean,
  setShowDeletions: () => void,
  data: Object,
}) => {
  const view = get(data, 'view')
  //console.log('AppContainer, view:', view)

  return (
    <ErrorBoundary>
      <Container>
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
      </Container>
    </ErrorBoundary>
  )
}

export default enhance(MyAppBar)
