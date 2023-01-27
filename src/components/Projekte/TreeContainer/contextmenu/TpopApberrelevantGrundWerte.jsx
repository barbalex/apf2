import React from 'react'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpop_apberrelevant_grund_werte',
}
const deleteData = {
  action: 'delete',
  table: 'tpop_apberrelevant_grund_werte',
}

const TpopApberrelevantGrundWerte = ({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu id="treeTpopApberrelevantGrundWerte" hideOnLeave={true}>
      <div className="react-contextmenu-title">Grund</div>
      <MenuItem onClick={onClick} data={insertData}>
        erstelle neuen
      </MenuItem>
      <MenuItem onClick={onClick} data={deleteData}>
        lösche
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default TpopApberrelevantGrundWerte
