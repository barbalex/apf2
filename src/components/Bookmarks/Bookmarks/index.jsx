import { memo } from 'react'
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

export const Bookmarks = memo(({ match }) => {
  const Bookmark = match?.handle?.bookmark

  return (
    <Container>
      {!!Bookmark ?
        <Bookmark />
      : null}
    </Container>
  )
})
