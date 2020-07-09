import React from 'react'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpop_apberrelevant_grund_werte',
}
const deleteData = {
  action: 'delete',
  table: 'tpop_apberrelevant_grund_werte',
}

const TpopApberrelevantGrundWerte = ({ onClick, treeName }) => (
  <ErrorBoundary>
    <ContextMenu id={`${treeName}tpopApberrelevantGrundWerte`}>
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
