import { memo } from 'react'

import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}

export const WerteListen = memo(({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeWlFolder"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">WerteListen</div>
      <MenuItem
        onClick={onClick}
        data={closeLowerNodesData}
      >
        alle schliessen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
))
