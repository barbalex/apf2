import React, { useEffect, useContext } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { Location } from '@reach/router'
import { withResizeDetector } from 'react-resize-detector'

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

const MyAppBar = ({ height }) => {
  const store = useContext(storeContext)
  const { setAppBarHeight } = store

  useEffect(() => {
    setAppBarHeight(height)
  }, [height, setAppBarHeight])

  return (
    <Location>
      {({ location }) => {
        const { pathname } = location
        const isHome = pathname === '/'
        const isProjekte = pathname.startsWith('/Daten')

        return (
          <ErrorBoundary>
            <StyledAppBar position="static">
              <StyledToolbar>
                {isHome ? <Home /> : isProjekte ? <Projekte /> : <Doku />}
              </StyledToolbar>
            </StyledAppBar>
          </ErrorBoundary>
        )
      }}
    </Location>
  )
}

export default withResizeDetector(observer(MyAppBar))
