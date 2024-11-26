import { memo, Suspense, useEffect, useContext } from 'react'
import styled from '@emotion/styled'
import { Outlet, useLocation, useParams, useNavigate } from 'react-router'
import { observer } from 'mobx-react-lite'

import { Bar } from './Bar/index.jsx'
import { EkfBar } from './EkfBar/index.jsx'
import { Bookmarks } from '../Bookmarks/index.jsx'
import { inIframe } from '../../modules/inIframe.js'
import { Spinner } from '../shared/Spinner.jsx'
import { StoreContext } from '../../storeContext.js'

const isInIframe = inIframe()
export const minWidthToShowTitle = 1040

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
  padding: 4px 0;
  background-color: #2e7d32;
  height: 38px;

  @media (max-width: ${minWidthToShowTitle - 1}px) {
    justify-content: flex-end;
  }

  @media print {
    display: none !important;
  }
`

export const Component = memo(
  observer(() => {
    const navigate = useNavigate()
    const { userId } = useParams()
    const { pathname, search } = useLocation()

    const store = useContext(StoreContext)
    const activeNodeArray = store.tree.activeNodeArray

    useEffect(() => {
      if (isInIframe) return

      // if app was opened on top level, navigate to last active node
      if (pathname === '/') {
        navigate('/Daten/' + activeNodeArray.join('/') + search)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isInIframe) return <Outlet />

    const showEkf =
      !!userId && pathname.startsWith(`/Daten/Benutzer/${userId}/EKF`)

    return (
      <Container>
        <Appbar>
          {showEkf ?
            <EkfBar />
          : <Bar />}
        </Appbar>
        <Bookmarks />
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </Container>
    )
  }),
)
