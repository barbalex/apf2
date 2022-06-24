import React, { Fragment, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

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

const Ap = ({ onClick, treeName }) => {
  const store = useContext(storeContext)
  const { user, moving } = store

  const isMoving = moving.table && moving.table === 'pop'
  const mayWrite = !userIsReadOnly(user.token)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}ap`} hideOnLeave={true}>
        <div className="react-contextmenu-title">Art</div>
        <MenuItem onClick={onClick} data={closeLowerNodesData}>
          alle schliessen
        </MenuItem>
        {mayWrite && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neuen
            </MenuItem>
            <MenuItem onClick={onClick} data={deleteData}>
              lösche
            </MenuItem>
          </>
        )}
        {isMoving && (
          <MenuItem onClick={onClick} data={moveData}>
            {`verschiebe '${moving.label}' hierhin`}
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(Ap)
