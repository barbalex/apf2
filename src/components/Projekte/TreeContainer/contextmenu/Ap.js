import React, { Fragment, useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'

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
      <ContextMenu id={`${treeName}ap`}>
        <div className="react-contextmenu-title">Aktionsplan</div>
        <MenuItem onClick={onClick} data={closeLowerNodesData}>
          alle schliessen
        </MenuItem>
        {mayWrite && (
          <Fragment>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neuen
            </MenuItem>
            <MenuItem onClick={onClick} data={deleteData}>
              lösche
            </MenuItem>
          </Fragment>
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
