import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

const insertData = {
  action: 'insert',
  table: 'ek_abrechnungstyp_werte',
}

export const EkAbrechnungstypWerteFolder = ({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeEkAbrechnungstypWerteFolder"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">EK-Abrechnungstyp</div>
      <MenuItem
        onClick={onClick}
        data={insertData}
      >
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)
