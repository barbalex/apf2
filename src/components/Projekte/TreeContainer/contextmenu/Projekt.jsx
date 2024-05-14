import React from 'react'

import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}

// TODO: add MenuItem for admins to add new projekt
const Projekt = ({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu id="treeProjekt" hideOnLeave={true}>
      <div className="react-contextmenu-title">Projekt</div>
      <MenuItem onClick={onClick} data={closeLowerNodesData}>
        alle schliessen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default Projekt
