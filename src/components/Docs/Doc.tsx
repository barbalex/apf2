import { Suspense } from 'react'
import { Outlet } from 'react-router'

import { Sidebar } from './DesktopSidebar/index.tsx'
import { MobileHeader } from './MobileHeader.tsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'
import { Spinner } from '../shared/Spinner.tsx'

import styles from './DesktopDocs.module.css'

// responsive layout for documentation pages:
// wide screens show the menu sidebar, narrow screens hide it
// (see DesktopDocs.module.css) and show MobileHeader instead,
// leading back to the documentation menu list
export const Component = () => (
  <ErrorBoundary>
    <div className={styles.container}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      <div className={styles.contentColumn}>
        <MobileHeader />
        <div className={styles.doku}>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  </ErrorBoundary>
)
