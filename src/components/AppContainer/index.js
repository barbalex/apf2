// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import Loadable from 'react-loadable'
import withLifecycle from '@hocs/with-lifecycle'
import app from 'ampersand-app'

import ErrorBoundary from '../shared/ErrorBoundary'
import Loading from '../shared/Loading'
import setIsPrint from './setIsPrint.graphql'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  @media print {
    height: auto;
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

const enhance = compose(
  withState('showDeletions', 'setShowDeletions', false),
  withLifecycle({
    onDidMount(prevProps, props) {
      console.log('AppCountainer did mount')
      window.matchMedia('print').addListener(mql => {
        if (mql.matches) {
          app.client.mutate({
            mutation: setIsPrint,
            variables: { value: true },
          })
        } else {
          app.client.mutate({
            mutation: setIsPrint,
            variables: { value: true },
          })
        }
      })
    },
    onWillUnmount() {
      window.matchMedia('print').removeListener()
    },
  })
)

const MyAppBar = ({
  showDeletions,
  setShowDeletions,
}: {
  showDeletions: Boolean,
  setShowDeletions: () => void,
}) => (
  <ErrorBoundary>
    <Container>
      <AppBar setShowDeletions={setShowDeletions} />
      <Projekte
        showDeletions={showDeletions}
        setShowDeletions={setShowDeletions}
      />
      <User />
      <Errors />
      <UpdateAvailable />
      <Messages />
    </Container>
  </ErrorBoundary>
)

export default enhance(MyAppBar)
