import { memo } from 'react'

import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpop_apberrelevant_grund_werte',
}
const deleteData = {
  action: 'delete',
  table: 'tpop_apberrelevant_grund_werte',
}

export const TpopApberrelevantGrundWerte = memo(({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeTpopApberrelevantGrundWerte"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">Grund</div>
      <MenuItem
        onClick={onClick}
        data={insertData}
      >
        erstelle neuen
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={deleteData}
      >
        lösche
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
))
