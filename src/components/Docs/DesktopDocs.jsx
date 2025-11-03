import { Sidebar } from './DesktopSidebar/index.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

import { container, doku } from './DesktopDocs.module.css'

export const DesktopDocs = () => (
  <ErrorBoundary>
    <div className={container}>
      <Sidebar />
      <div className={doku}>
        <div />
      </div>
    </div>
  </ErrorBoundary>
)
