import React from 'react'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'ek_abrechnungstyp_werte',
}

const EkAbrechnungstypWerteFolder = ({ onClick, treeName }) => (
  <ErrorBoundary>
    <ContextMenu
      id={`${treeName}ekAbrechnungstypWerteFolder`}
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">EK-Abrechnungstyp</div>
      <MenuItem onClick={onClick} data={closeLowerNodesData}>
        alle schliessen
      </MenuItem>
      <MenuItem onClick={onClick} data={insertData}>
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default EkAbrechnungstypWerteFolder
