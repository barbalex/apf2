import React from 'react'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'adresse',
}
const deleteData = {
  action: 'delete',
  table: 'adresse',
}

const Adresse = ({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu id="treeAdresse" hideOnLeave={true}>
      <div className="react-contextmenu-title">Adresse</div>
      <MenuItem onClick={onClick} data={insertData}>
        erstelle neue
      </MenuItem>
      <MenuItem onClick={onClick} data={deleteData}>
        lösche
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default Adresse
