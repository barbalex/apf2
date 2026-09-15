import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'adresse',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const Adressefolder = ({ onClick }: Props) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeAdresseFolder"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">Adressen</div>
      <MenuItem
        onClick={onClick}
        data={closeLowerNodesData}
      >
        alle schliessen
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={insertData}
      >
        erstelle neue
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)
