// @flow
import React from 'react'
import styled from 'styled-components'
import Loadable from 'react-loadable'

import ErrorBoundary from './shared/ErrorBoundary'
import Loading from './shared/Loading'
const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const User = Loadable({
  loader: () => import('./User'),
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
const ApberForAp = Loadable({
  loader: () => import('./ApberForAp'),
  loading: Loading,
})

const Print = ({ activeNodeArray }:{ activeNodeArray: Array<String> }) => {
  return (
    <ErrorBoundary>
      <Container>
        <User />
        <Errors />
        <UpdateAvailable />
      </Container>
    </ErrorBoundary>
  )
}

export default Print
