import { memo } from 'react'
import { useMatches, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

const Container = styled.div`
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

export const NavTo = memo(() => {
  const { pathname } = useLocation()
  const matches = useMatches()
  // get match that contains the current pathname minus the last slash - if it ends with a slash
  // TODO: ensure this works for all cases
  const match = matches.find(
    (m) => m.pathname === pathname || `${m.pathname}/` === pathname,
  )
  const Nav = match?.handle?.nav

  return (
    <Container>
      {!!Nav ?
        <Nav />
      : null}
    </Container>
  )
})
