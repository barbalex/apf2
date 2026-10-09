import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

const insertData = {
  action: 'insert',
  table: 'ek_abrechnungstyp_werte',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const EkAbrechnungstypWerteFolder = ({ onClick }: Props) => (
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
