import { Suspense } from 'react'
import styled from '@emotion/styled'
import { Outlet } from 'react-router'

import { Sidebar } from './DesktopSidebar/index.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { Spinner } from '../shared/Spinner.jsx'
import { Container, Doku, DokuDate, Code } from './DesktopDocs.jsx'

export const Component = () => (
  <Container>
    <Doku>
      <Outlet />
    </Doku>
  </Container>
)
