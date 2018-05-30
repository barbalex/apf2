// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import Loadable from 'react-loadable'

import ErrorBoundary from './shared/ErrorBoundary'
import Loading from './shared/Loading'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const AppBar = Loadable({
  loader: () => import('./AppBar'),
  loading: Loading,
})
const Projekte = Loadable({
  loader: () => import('./Projekte'),
  loading: Loading,
})
const User = Loadable({
  loader: () => import('./User'),
  loading: Loading,
})
const Deletions = Loadable({
  loader: () => import('./Deletions'),
  loading: Loading,
})
const Errors = Loadable({
  loader: () => import('./Errors'),
  loading: Loading,
})
const UpdateAvailable = Loadable({
  loader: () => import('./UpdateAvailable'),
  loading: Loading,
})
const Messages = Loadable({
  loader: () => import('./Messages'),
  loading: Loading,
})

const enhance = compose(
  withState('showDeletions', 'setShowDeletions', false),
)

const MyAppBar = ({
  showDeletions,
  setShowDeletions,
}: {
  showDeletions: Boolean,
  setShowDeletions: () => void,
}) =>
  <ErrorBoundary>
    <Container>
      <AppBar setShowDeletions={setShowDeletions} />
      <Projekte />
      <User />
      <Deletions
        showDeletions={showDeletions}
        setShowDeletions={setShowDeletions}
      />
      <Errors />
      <UpdateAvailable />
      <Messages />
    </Container>
  </ErrorBoundary>

export default enhance(MyAppBar)
