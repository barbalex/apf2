import React from 'react'

import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

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
