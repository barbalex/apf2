import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopkontrzaehl_einheit_werte',
}
const deleteData = {
  action: 'delete',
  table: 'tpopkontrzaehl_einheit_werte',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const TpopkontrzaehlEinheitWerte = ({ onClick }: Props) => (
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
)
