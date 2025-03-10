import { memo, Fragment, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

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

export const Ap = memo(
  observer(({ onClick }) => {
    const store = useContext(MobxContext)
    const { user, moving } = store

    const isMoving = moving.table && moving.table === 'pop'
    const mayWrite = !userIsReadOnly(user.token)

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
  }),
)
