import { memo } from 'react'
import { Outlet } from 'react-router'

import { Container, Doku } from './DesktopDocs.jsx'

const dokuStyle = {
  padding: '0 10px 10px 10px',
}

export const Component = memo(() => (
  <Container>
    <Doku stye={dokuStyle}>
      <Outlet />
    </Doku>
  </Container>
))
