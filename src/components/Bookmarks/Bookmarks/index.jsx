import { memo } from 'react'
import { useMatches, useLocation } from 'react-router'
import styled from '@emotion/styled'

const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  fex-grow: 1;
  flex-shrink: 0;
  padding: 0 3px;
  height: 40px;
  min-height: 40px;
  border-bottom: rgba(46, 125, 50, 0.5) solid 1px;
  overflow-x: overlay;
  scrollbar-width: thin;
`

export const Bookmarks = memo(() => {
  const { pathname } = useLocation()
  const allMatches = useMatches()
  // get match that contains the current pathname minus the last slash - if it ends with a slash
  // Hm. So many matches. Often multiple with same path. Hard to find the right one.
  // TODO: ensure this works for all cases
  const bookmarkMatches = allMatches.filter(
    (m) =>
      (m.pathname === pathname || `${m.pathname}/` === pathname) &&
      m.handle?.bookmark,
  )

  return (
    <Container>
      {bookmarkMatches.map((match) => {
        const Bookmark = match.handle?.bookmark
        if (!Bookmark) return null
        return <Bookmark key={match.id} />
      })}
    </Container>
  )
})
