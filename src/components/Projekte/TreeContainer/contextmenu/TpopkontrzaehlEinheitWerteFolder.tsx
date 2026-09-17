import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

const insertData = {
  action: 'insert',
  table: 'tpopkontrzaehl_einheit_werte',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const TpopkontrzaehlEinheitWerteFolder = ({ onClick }: Props) => (
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
