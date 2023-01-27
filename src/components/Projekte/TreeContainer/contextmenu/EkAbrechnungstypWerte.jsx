import React from 'react'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'ek_abrechnungstyp_werte',
}
const deleteData = {
  action: 'delete',
  table: 'ek_abrechnungstyp_werte',
}

const EkAbrechnungstypWerte = ({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu id="treeEkAbrechnungstypWerte" hideOnLeave={true}>
      <div className="react-contextmenu-title">EK-Abrechnungstyp</div>
      <MenuItem onClick={onClick} data={insertData}>
        erstelle neue
      </MenuItem>
      <MenuItem onClick={onClick} data={deleteData}>
        lösche
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default EkAbrechnungstypWerte
