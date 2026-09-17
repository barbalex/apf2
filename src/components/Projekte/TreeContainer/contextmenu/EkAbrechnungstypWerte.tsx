import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'ek_abrechnungstyp_werte',
}
const deleteData = {
  action: 'delete',
  table: 'ek_abrechnungstyp_werte',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const EkAbrechnungstypWerte = ({ onClick }: Props) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeEkAbrechnungstypWerte"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">EK-Abrechnungstyp</div>
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
