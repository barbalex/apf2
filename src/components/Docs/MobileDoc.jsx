import { memo } from 'react'
import { Outlet } from 'react-router'

import { Container, Doku } from './DesktopDocs.jsx'

export const Component = memo(() => (
  <Container>
    <Doku>
      <Outlet />
    </Doku>
  </Container>
))
