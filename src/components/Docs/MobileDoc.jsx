import { Outlet } from 'react-router'

import { container, doku } from './DesktopDocs.module.css'
import { doku as myDokuClass } from './MobileDoc.module.css'

export const Component = () => (
  <div className={container}>
    <div className={`${doku} ${myDokuClass}`}>
      <Outlet />
    </div>
  </div>
)
