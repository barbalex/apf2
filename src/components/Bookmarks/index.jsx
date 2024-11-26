import { memo } from 'react'

export const Bookmarks = memo(() => {
  return <div>{`Bookmarks. Window width: ${window.innerWidth}`}</div>
})
