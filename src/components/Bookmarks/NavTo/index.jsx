import { memo, useState, useEffect, useContext } from 'react'
import { useMatches, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'

import { useRootNavData } from '../../../modules/useRootNavData.js'
import { StoreContext } from '../../../storeContext.js'

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

  console.log('NavTo', { pathname, match, Nav })

  return <Nav />
})
