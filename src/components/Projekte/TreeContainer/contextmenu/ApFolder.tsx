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
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'ap',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const Apfolder = ({ onClick }: Props) => {
  const userToken = useAtomValue(userTokenAtom)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeApFolder"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Art</div>
        <MenuItem
          onClick={onClick}
          data={closeLowerNodesData}
        >
          alle schliessen
        </MenuItem>
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
