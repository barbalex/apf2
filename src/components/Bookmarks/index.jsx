import { memo } from 'react'
import { useMatches, useLocation } from 'react-router'

import { NavTo } from './NavTo/index.jsx'
import { Bookmarks as Bookmarkss } from './Bookmarks/index.jsx'

export const Bookmarks = memo(() => (
  <>
    <Bookmarkss />
    {/* <NavTo /> */}
  </>
))
