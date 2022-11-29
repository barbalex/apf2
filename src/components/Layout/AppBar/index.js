import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import styled from '@emotion/styled'
import { useLocation } from '@reach/router'

import HomeBar from './Home'
import DokuBar from './Doku'
import ProjekteBar from './Projekte'
import ErrorBoundary from '../../shared/ErrorBoundary'

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

const MyAppBar = () => {
  const location = useLocation()
  const { pathname } = location
  const isHome = pathname === '/'
  const isProjekte = pathname.startsWith('/Daten')

  return (
    <ErrorBoundary>
      <StyledAppBar position="static">
        <StyledToolbar>
          {isHome ? <HomeBar /> : isProjekte ? <ProjekteBar /> : <DokuBar />}
        </StyledToolbar>
      </StyledAppBar>
    </ErrorBoundary>
  )
}

export default MyAppBar
