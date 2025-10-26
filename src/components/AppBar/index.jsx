import { Suspense, useEffect, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'
import { Outlet, useLocation, useParams, useNavigate } from 'react-router'
import { useAtom } from 'jotai'

import { Bar } from './Bar/index.jsx'
import { EkfBar } from './EkfBar/index.jsx'
import { inIframe } from '../../modules/inIframe.js'
import { Spinner } from '../shared/Spinner.jsx'
import { MobxContext } from '../../mobxContext.js'
import { constants } from '../../modules/constants.js'
import { isMobileViewAtom } from '../../JotaiStore/index.js'
import { IsDesktopViewSetter } from '../IsDesktopViewSetter.jsx'

const isInIframe = inIframe()

const Container = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media print {
    height: auto;
    overflow: visible !important;
  }
`
const Appbar = styled.div`
  position: static;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => (props.mobile === 'true' ? 0 : 4)}px 0;
  background-color: #2e7d32;
  height: 38px;

  @media (max-width: ${constants.minWidthToShowTitle - 1}px) {
    justify-content: flex-end;
  }

  @media print {
    display: none !important;
  }
`

export const Component = observer(() => {
  const navigate = useNavigate()
  const { userId } = useParams()
  const { pathname, search } = useLocation()

  const store = useContext(MobxContext)
  const activeNodeArray = store.tree.activeNodeArray

  const [isMobileView] = useAtom(isMobileViewAtom)

  useEffect(() => {
    if (isInIframe) return

    // if app was opened on top level, navigate to last active node
    // but only if activeNodeArray is not empty
    // otherwise first time users are navigated to the login
    if (pathname === '/' && activeNodeArray.length > 0) {
      navigate('/Daten/' + activeNodeArray.join('/') + search)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isInIframe) return <Outlet />

  const showEkf =
    !!userId && pathname.startsWith(`/Daten/Benutzer/${userId}/EKF`)

  return (
    <Container>
      <IsDesktopViewSetter />
      <Appbar mobile={isMobileView.toString()}>
        {showEkf ?
          <EkfBar />
        : <Bar />}
      </Appbar>
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </Container>
  )
})
