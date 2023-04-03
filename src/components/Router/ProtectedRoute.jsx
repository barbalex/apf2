import { useContext, lazy, Suspense } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router-dom'
// import { getSnapshot } from 'mobx-state-tree'
import jwtDecode from 'jwt-decode'
import { useLocation, useParams, Navigate } from 'react-router-dom'

import storeContext from '../../storeContext'
const User = lazy(() => import('../User'))
const Messages = lazy(() => import('../Messages'))
const Deletions = lazy(() => import('../Deletions'))
import inIframe from '../../modules/inIframe'
const ActiveNodeArraySetter = lazy(() => import('./ActiveNodeArraySetter'))
const NavigateSetter = lazy(() => import('./NavigateSetter'))
const ApfLayerNotifier = lazy(() => import('./ApfLayerNotifier'))
const QueryClientSetter = lazy(() => import('./QueryClientSetter'))
import Spinner from '../shared/Spinner'

const isInIframe = inIframe()

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

const ProtectedRoute = () => {
  const { pathname, search } = useLocation()
  const { userId } = useParams()

  const store = useContext(storeContext)
  const { showDeletions, user } = store

  const token = user?.token
  const tokenDecoded = token ? jwtDecode(token) : null
  const role = tokenDecoded ? tokenDecoded.role : null
  const isFreiwillig = role === 'apflora_freiwillig'
  const userIdToUse = userId ?? user?.id

  // if user is freiwillig
  // and path is not in /Benutzer/:userId
  // then redirect to /Benutzer/:userId/EKF
  // userId was undefined thus not navigating
  const shouldNavigate =
    isFreiwillig &&
    userIdToUse &&
    !pathname.includes(`Daten/Benutzer/${userIdToUse}`)
  if (shouldNavigate) {
    return (
      <Navigate
        to={`/Daten/Benutzer/${userIdToUse}/EKF/${new Date().getFullYear()}${search}`}
      />
    )
  }

  return (
    <Container>
      {!!user.token && (
        <>
          <Outlet />
          <Suspense fallback={<Spinner />}>
            {!isFreiwillig && !isInIframe && <Messages />}
            {!isFreiwillig && showDeletions && <Deletions />}
          </Suspense>
          <Suspense fallback={null}>
            <ActiveNodeArraySetter />
            <NavigateSetter />
            <QueryClientSetter />
            <ApfLayerNotifier />
          </Suspense>
        </>
      )}
      <Suspense fallback={null}>
        <User />
      </Suspense>
    </Container>
  )
}

export const Component = observer(ProtectedRoute)
