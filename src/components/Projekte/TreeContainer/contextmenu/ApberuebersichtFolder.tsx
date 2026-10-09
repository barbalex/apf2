import { useAtomValue } from 'jotai'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import { userTokenAtom } from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'apberuebersicht',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const ApberuebersichtFolder = ({ onClick }: Props) => {
  const userToken = useAtomValue(userTokenAtom)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeApberuebersichtFolder"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">AP-Bericht</div>
        {!userIsReadOnly(userToken) && (
          <MenuItem
            onClick={onClick}
            data={insertData}
          >
            erstelle neuen
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}
