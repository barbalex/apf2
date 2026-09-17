import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

const insertData = {
  action: 'insert',
  table: 'tpop_apberrelevant_grund_werte',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const TpopApberrelevantGrundWerteFolder = ({ onClick }: Props) => (
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
