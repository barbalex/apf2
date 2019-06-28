import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import ErrorBoundary from 'react-error-boundary'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}

const WerteListen = ({ onClick, treeName }) => (
  <ErrorBoundary>
    <ContextMenu id={`${treeName}wlFolder`}>
      <div className="react-contextmenu-title">WerteListen</div>
      <MenuItem onClick={onClick} data={closeLowerNodesData}>
        alle schliessen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default WerteListen
