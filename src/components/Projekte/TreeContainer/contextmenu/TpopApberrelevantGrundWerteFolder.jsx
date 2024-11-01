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
const insertData = {
  action: 'insert',
  table: 'tpop_apberrelevant_grund_werte',
}

export const TpopApberrelevantGrundWerteFolder = memo(({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeTpopApberrelevantGrundWerteFolder"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">Gründe</div>
      <MenuItem
        onClick={onClick}
        data={closeLowerNodesData}
      >
        alle schliessen
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={insertData}
      >
        erstelle neuen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
))
