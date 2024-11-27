import { memo } from 'react'

import { NavTo } from './NavTo/index.jsx'

export const Bookmarks = memo(() => {
  // TODO:
  // from top do bottom
  // get: bookmarks (label, url) and children (array of same)
  // build ui from bookmarks
  // if children: render as menu
  return (
    <>
      <div>{`Bookmarks. Window width: ${window.innerWidth}`}</div>
      <NavTo />
    </>
  )
})
