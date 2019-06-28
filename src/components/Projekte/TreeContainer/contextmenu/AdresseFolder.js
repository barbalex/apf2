import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import ErrorBoundary from 'react-error-boundary'


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
    <ContextMenu id={`${treeName}adresseFolder`}>
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
