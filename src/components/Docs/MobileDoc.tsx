import { Outlet } from 'react-router'

import desktopStyles from './DesktopDocs.module.css'
import styles from './MobileDoc.module.css'

export const Component = () => (
  <div className={desktopStyles.container}>
    <div className={`${desktopStyles.doku} ${styles.doku}`}>
      <Outlet />
    </div>
  </div>
)
