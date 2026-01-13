import { Suspense } from 'react'
import { Outlet } from 'react-router'

import { Sidebar } from './DesktopSidebar/index.tsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { Spinner } from '../shared/Spinner.jsx'

import styles from './DesktopDocs.module.css'

export const Component = () => (
  <ErrorBoundary>
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.doku}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  </ErrorBoundary>
)
