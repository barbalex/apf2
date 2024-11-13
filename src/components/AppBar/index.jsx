import { memo, Suspense, useEffect, useContext } from 'react'
import styled from '@emotion/styled'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { Bar } from './Bar/index.jsx'
import { EkfBar } from './EkfBar/index.jsx'
import { inIframe } from '../../modules/inIframe.js'
import { Spinner } from '../shared/Spinner.jsx'
import { StoreContext } from '../../storeContext.js'

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
const StyledAppBar = styled(MuiAppBar)`
  flex-basis: 64px !important;
  flex-shrink: 0 !important;
  flex-grow: 0 !important;

  @media print {
    display: none !important;
  }
`
const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
  padding-left: 4px !important;
  padding-right: 4px !important;
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
        <StyledAppBar position="static">
          <StyledToolbar>
            {showEkf ?
              <EkfBar />
            : <Bar />}
          </StyledToolbar>
        </StyledAppBar>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </Container>
    )
  }),
)
