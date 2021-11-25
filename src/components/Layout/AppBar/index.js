import React, { useContext, useCallback } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import styled from 'styled-components'
import { useLocation } from '@reach/router'
import { useResizeDetector } from 'react-resize-detector'
import { observer } from 'mobx-react-lite'

import Home from './Home'
import Doku from './Doku'
import Projekte from './Projekte'
import ErrorBoundary from '../../shared/ErrorBoundary'
import storeContext from '../../../storeContext'

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

  const { setAppBarHeight } = useContext(storeContext)
  const onResize = useCallback(
    (width, height) => {
      //console.log('AppBar, height: ', height)
      setAppBarHeight(height)
    },
    [setAppBarHeight],
  )

  const { ref: resizeRef } = useResizeDetector({
    onResize,
    handleWidth: false,
  })

  return (
    <ErrorBoundary>
      <StyledAppBar position="static" ref={resizeRef}>
        <StyledToolbar>
          {isHome ? <Home /> : isProjekte ? <Projekte /> : <Doku />}
        </StyledToolbar>
      </StyledAppBar>
    </ErrorBoundary>
  )
}

export default observer(MyAppBar)
