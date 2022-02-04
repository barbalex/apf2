import React from 'react'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'adresse',
}

const Apfolder = ({ onClick, treeName }) => (
  <ErrorBoundary>
    <ContextMenu id={`${treeName}adresseFolder`} hideOnLeave={true}>
      <div className="react-contextmenu-title">Adressen</div>
      <MenuItem onClick={onClick} data={closeLowerNodesData}>
        alle schliessen
      </MenuItem>
      <MenuItem onClick={onClick} data={insertData}>
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default Apfolder
