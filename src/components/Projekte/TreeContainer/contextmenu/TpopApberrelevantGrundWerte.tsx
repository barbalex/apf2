import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpop_apberrelevant_grund_werte',
}
const deleteData = {
  action: 'delete',
  table: 'tpop_apberrelevant_grund_werte',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const TpopApberrelevantGrundWerte = ({ onClick }: Props) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeTpopApberrelevantGrundWerte"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">Grund</div>
      <MenuItem
        onClick={onClick}
        data={insertData}
      >
        erstelle neuen
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={deleteData}
      >
        lösche
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)
