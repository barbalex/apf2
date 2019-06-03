import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopkontrzaehl_einheit_werte',
}
const deleteData = {
  action: 'delete',
  table: 'tpopkontrzaehl_einheit_werte',
}

const TpopkontrzaehlEinheitWerte = ({ onClick, treeName }) => (
  <ErrorBoundary>
    <ContextMenu id={`${treeName}tpopkontrzaehlEinheitWerte`}>
      <div className="react-contextmenu-title">Zähl-Einheit</div>
      <MenuItem onClick={onClick} data={insertData}>
        erstelle neue
      </MenuItem>
      <MenuItem onClick={onClick} data={deleteData}>
        lösche
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default TpopkontrzaehlEinheitWerte
