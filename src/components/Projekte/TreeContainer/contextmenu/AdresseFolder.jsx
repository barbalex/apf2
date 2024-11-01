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
  table: 'adresse',
}

export const Adressefolder = memo(({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeAdresseFolder"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">Adressen</div>
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
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
))
