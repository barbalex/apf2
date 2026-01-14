import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

const insertData = {
  action: 'insert',
  table: 'tpop_apberrelevant_grund_werte',
}

export const TpopApberrelevantGrundWerteFolder = ({ onClick }) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeTpopApberrelevantGrundWerteFolder"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">Gründe</div>
      <MenuItem
        onClick={onClick}
        data={insertData}
      >
        erstelle neuen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)
