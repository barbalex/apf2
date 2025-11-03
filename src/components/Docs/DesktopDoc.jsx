import { Suspense } from 'react'
import { Outlet } from 'react-router'

import { Sidebar } from './DesktopSidebar/index.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { Spinner } from '../shared/Spinner.jsx'
import { Container, Doku, DokuDate, Code } from './DesktopDocs.jsx'

export const Component = () => (
  <ErrorBoundary>
    <Container>
      <Sidebar />
      <Doku>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </Doku>
    </Container>
  </ErrorBoundary>
)
