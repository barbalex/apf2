import { Sidebar } from './DesktopSidebar/index.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

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
