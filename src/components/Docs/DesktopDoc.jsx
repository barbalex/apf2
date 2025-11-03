import { Suspense } from 'react'
import { Outlet } from 'react-router'

import { Sidebar } from './DesktopSidebar/index.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { Spinner } from '../shared/Spinner.jsx'

import { container, doku } from './DesktopDocs.module.css'

export const Component = () => (
  <ErrorBoundary>
    <div className={container}>
      <Sidebar />
      <div className={doku}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  </ErrorBoundary>
)
