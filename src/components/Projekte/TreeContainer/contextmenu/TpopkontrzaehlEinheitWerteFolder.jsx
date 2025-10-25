import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

const insertData = {
  action: 'insert',
  table: 'tpopkontrzaehl_einheit_werte',
}

export const TpopkontrzaehlEinheitWerteFolder = ({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeTpopkontrzaehlEinheitWerteFolder"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">Zähl-Einheiten</div>
      <MenuItem
        onClick={onClick}
        data={insertData}
      >
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)
