import React from 'react'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}

// TODO: add MenuItem for admins to add new projekt
const Projekt = ({ onClick, treeName }) => (
  <ErrorBoundary>
    <ContextMenu id={`${treeName}projekt`}>
      <div className="react-contextmenu-title">Projekt</div>
      <MenuItem onClick={onClick} data={closeLowerNodesData}>
        alle schliessen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default Projekt
