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
  table: 'user',
}
const deleteData = {
  action: 'delete',
  table: 'user',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const User = ({ onClick }: Props) => {
  const userToken = useAtomValue(userTokenAtom)

  const mayWrite = !userIsReadOnly(userToken)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeUser"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Benutzer</div>
        {mayWrite && (
          <>
            <MenuItem
              onClick={onClick}
              data={insertData}
            >
              erstelle neuen
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={deleteData}
            >
              lösche
            </MenuItem>
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}
