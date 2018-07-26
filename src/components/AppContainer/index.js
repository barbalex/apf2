// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import Loadable from 'react-loadable'
import withLifecycle from '@hocs/with-lifecycle'
import app from 'ampersand-app'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import ErrorBoundary from '../shared/ErrorBoundary'
import Loading from '../shared/Loading'
import setIsPrint from './setIsPrint.graphql'
import dataGql from './data.graphql'
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

const enhance = compose(
  withState('showDeletions', 'setShowDeletions', false),
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
  })
)

const MyAppBar = ({
  showDeletions,
  setShowDeletions,
}: {
  showDeletions: Boolean,
  setShowDeletions: () => void,
}) => (
  <Query query={dataGql}>
    {({ loading, error, data, client }) => {
      if (error) return `Fehler: ${error.message}`
      const view = get(data, 'view')

      return (
        <ErrorBoundary>
          <Container>
            <AppBar setShowDeletions={setShowDeletions} />
            {view === 'ekf' && <div>ekf</div>}
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
    }}
  </Query>
)

export default enhance(MyAppBar)
