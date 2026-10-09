import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'adresse',
}
const deleteData = {
  action: 'delete',
  table: 'adresse',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const Adresse = ({ onClick }: Props) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeAdresse"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">Adresse</div>
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
