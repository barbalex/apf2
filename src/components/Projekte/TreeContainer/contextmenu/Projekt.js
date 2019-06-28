import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import ErrorBoundary from 'react-error-boundary'

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
