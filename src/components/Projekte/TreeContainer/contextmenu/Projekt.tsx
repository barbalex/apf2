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

// TODO: add MenuItem for admins to add new projekt
interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const Projekt = ({ onClick }: Props) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeProjekt"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">Projekt</div>
      <MenuItem
        onClick={onClick}
        data={closeLowerNodesData}
      >
        alle schliessen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)
