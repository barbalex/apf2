import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'tpop_apberrelevant_grund_werte',
}

const TpopApberrelevantGrundWerteFolder = ({ onClick, treeName }) => (
  <ErrorBoundary>
    <ContextMenu id={`${treeName}tpopApberrelevantGrundWerteFolder`}>
      <div className="react-contextmenu-title">Gründe</div>
      <MenuItem onClick={onClick} data={closeLowerNodesData}>
        alle schliessen
      </MenuItem>
      <MenuItem onClick={onClick} data={insertData}>
        erstelle neuen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default TpopApberrelevantGrundWerteFolder
