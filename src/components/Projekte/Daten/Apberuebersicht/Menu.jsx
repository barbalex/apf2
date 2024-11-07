import { memo } from 'react'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'

export const Menu = memo(({ row }) => {
  return (
    <ErrorBoundary>
      <MenuBar>
        <div>Menu</div>
      </MenuBar>
    </ErrorBoundary>
  )
})
