import { Sidebar } from './DesktopSidebar/index.tsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'

import styles from './DesktopDocs.module.css'

export const DesktopDocs = () => (
  <ErrorBoundary>
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.doku}>
        <div />
      </div>
    </div>
  </ErrorBoundary>
)
