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

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const WerteListen = ({ onClick }: Props) => (
  <ErrorBoundary>
    <ContextMenu
      id="treeWlFolder"
      hideOnLeave={true}
    >
      <div className="react-contextmenu-title">WerteListen</div>
      <MenuItem
        onClick={onClick}
        data={closeLowerNodesData}
      >
        alle schliessen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)
