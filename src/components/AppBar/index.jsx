import React from 'react'
import styled from '@emotion/styled'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { Outlet, useLocation, useParams } from 'react-router-dom'

import Bar from './Bar'
import EkfBar from './EkfBar'
import inIframe from '../../modules/inIframe'

const isInIframe = inIframe()

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;

  @media print {
    height: auto;
    overflow: visible !important;
  }
`
const StyledAppBar = styled(AppBar)`
  min-height: 64px !important;

  @media print {
    display: none !important;
  }
`
const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
  padding-left: 4px !important;
  padding-right: 4px !important;
`

const AppBarComponent = () => {
  const { userId } = useParams()
  const { pathname } = useLocation()

  if (isInIframe) return <Outlet />

  const showEkf =
    !!userId && pathname.startsWith(`/Daten/Benutzer/${userId}/EKF`)

  return (
    <Container>
      <StyledAppBar position="static">
        <StyledToolbar>{showEkf ? <EkfBar /> : <Bar />}</StyledToolbar>
      </StyledAppBar>
      <Outlet />
    </Container>
  )
}

export default AppBarComponent
