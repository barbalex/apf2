import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'ek_abrechnungstyp_werte',
}
const deleteData = {
  action: 'delete',
  table: 'ek_abrechnungstyp_werte',
}

const EkAbrechnungstypWerte = ({ onClick, treeName }) => (
  <ErrorBoundary>
    <ContextMenu id={`${treeName}ekAbrechnungstypWerte`}>
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
