import { memo } from 'react'
import { useMatches, useLocation } from 'react-router'
import styled from '@emotion/styled'

import { NavTo } from './NavTo/index.jsx'
import { Bookmarks as Bookmarkss } from './Bookmarks/index.jsx'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  padding: 0 12px;
  height: 40px;
  border-top: rgba(46, 125, 50, 0.5) solid 1px;
  border-bottom: rgba(46, 125, 50, 0.5) solid 1px;
`

export const Bookmarks = memo(() => {
  const { pathname } = useLocation()
  const allMatches = useMatches()
  // get match that contains the current pathname minus the last slash - if it ends with a slash
  // Hm. So many matches. Often multiple with same path. Hard to find the right one.
  // TODO: ensure this works for all cases
  const matches = allMatches.filter(
    (m) =>
      (m.pathname === pathname || `${m.pathname}/` === pathname) &&
      m.handle?.nav,
  )
  const match = matches?.[0]
  const Nav = match?.handle?.nav
  const Bookmark = match?.handle?.bookmark

  // TODO:
  // from top do bottom
  // get: bookmarks (label, url) and children (array of same)
  // build ui from bookmarks
  // if children: render as menu
  return (
    <>
      <Bookmarkss match={match} />
      <NavTo match={match} />
    </>
  )
})
