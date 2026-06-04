import { useAtomValue } from 'jotai'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import { userTokenAtom, movingAtom } from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'ap',
}
const deleteData = {
  action: 'delete',
  table: 'ap',
}
const moveData = {
  action: 'move',
}

export const Ap = ({ onClick }) => {
  const moving = useAtomValue(movingAtom)
  const userToken = useAtomValue(userTokenAtom)

  const isMoving = moving.table && moving.table === 'pop'
  const mayWrite = !userIsReadOnly(userToken)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeAp"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Art</div>
        <MenuItem
          onClick={onClick}
          data={closeLowerNodesData}
        >
          alle schliessen
        </MenuItem>
        {mayWrite && (
          <>
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
          </>
        )}
        {isMoving && (
          <MenuItem
            onClick={onClick}
            data={moveData}
          >
            {`verschiebe '${moving.label}' hierhin`}
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}
