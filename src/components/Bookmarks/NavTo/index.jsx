import { memo, useState, useEffect, useContext } from 'react'
import { useMatches, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { StoreContext } from '../../../storeContext.js'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  padding: 0 3px 0 5px;
  height: 40px;
  min-height: 40px;
  border-bottom: rgba(46, 125, 50, 0.5) solid 1px;
`

export const NavTo = memo(() => {
  const store = useContext(StoreContext)
  const { pathname } = useLocation()
  const matches = useMatches()
  // get match that contains the current pathname minus the last slash - if it ends with a slash
  // TODO: ensure this works for all cases
  const match = matches.find(
    (m) => m.pathname === pathname || `${m.pathname}/` === pathname,
  )
  const Nav = match?.handle?.nav

  return <Container>{Nav ? <Nav /> : null}</Container>


})
