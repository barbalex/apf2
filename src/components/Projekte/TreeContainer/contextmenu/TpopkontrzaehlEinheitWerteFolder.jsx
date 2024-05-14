import React from 'react'

import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'tpopkontrzaehl_einheit_werte',
}

const TpopkontrzaehlEinheitWerteFolder = ({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu id="treeTpopkontrzaehlEinheitWerteFolder" hideOnLeave={true}>
      <div className="react-contextmenu-title">Zähl-Einheiten</div>
      <MenuItem onClick={onClick} data={closeLowerNodesData}>
        alle schliessen
      </MenuItem>
      <MenuItem onClick={onClick} data={insertData}>
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default TpopkontrzaehlEinheitWerteFolder
