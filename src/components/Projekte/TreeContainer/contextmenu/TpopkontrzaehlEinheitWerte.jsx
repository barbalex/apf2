import { memo } from 'react'

import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopkontrzaehl_einheit_werte',
}
const deleteData = {
  action: 'delete',
  table: 'tpopkontrzaehl_einheit_werte',
}

export const TpopkontrzaehlEinheitWerte = memo(({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeTpopkontrzaehlEinheitWerte"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">Zähl-Einheit</div>
      <MenuItem
        onClick={onClick}
        data={insertData}
      >
        erstelle neue
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
