import { memo, useContext, lazy, Suspense } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { Outlet } from 'react-router'
// import { getSnapshot } from 'mobx-state-tree'
import { jwtDecode } from 'jwt-decode'
import { useLocation, useParams, Navigate } from 'react-router'

import { MobxContext } from '../../mobxContext.js'
const User = lazy(async () => ({ default: (await import('../User.jsx')).User }))
const Messages = lazy(async () => ({
  default: (await import('../Messages/index.jsx')).Messages,
}))
const Deletions = lazy(async () => ({
  default: (await import('../Deletions/index.jsx')).Deletions,
}))
import { inIframe } from '../../modules/inIframe.js'
const ActiveNodeArraySetter = lazy(async () => ({
  default: (await import('./ActiveNodeArraySetter')).ActiveNodeArraySetter,
}))
const NavigateSetter = lazy(async () => ({
  default: (await import('./NavigateSetter')).NavigateSetter,
}))
const ApfLayerNotifier = lazy(async () => ({
  default: (await import('./ApfLayerNotifier')).ApfLayerNotifier,
}))
const QueryClientSetter = lazy(async () => ({
  default: (await import('./QueryClientSetter')).QueryClientSetter,
}))
const ChooseApToCopyEkfrequenzsFrom = lazy(async () => ({
  default: (await import('./ChooseApToCopyEkfrequenzsFrom'))
    .ChooseApToCopyEkfrequenzsFrom,
}))
const ChooseApToCopyErfkritsFrom = lazy(async () => ({
  default: (await import('./ChooseApToCopyErfkritsFrom'))
    .ChooseApToCopyErfkritsFrom,
}))

import { Spinner } from '../shared/Spinner.jsx'

const isInIframe = inIframe()

// in iframes width and height need to be set, so are set to 100%
// this need to set height of container to 100% for the iframe
const Container = styled.div`
  background-color: #fffde7;
  ${(props) => (props['data-isiniframe'] ? 'height: 100%;' : 'flex-grow: 1;')}
  overflow: auto;
  scrollbar-width: thin;
  display: flex;
  flex-direction: column;

  @media print {
    margin-top: 0;
    height: auto;
    overflow: visible !important;
    background-color: white;
  }
`

export const Component = memo(
  observer(() => {
    const { pathname, search } = useLocation()
    const { userId } = useParams()

    const store = useContext(MobxContext)
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
      <Container data-isiniframe={isInIframe}>
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
              <ChooseApToCopyEkfrequenzsFrom />
              <ChooseApToCopyErfkritsFrom />
              <ApfLayerNotifier />
            </Suspense>
          </>
        )}
        <Suspense fallback={null}>
          <User />
        </Suspense>
      </Container>
    )
  }),
)
