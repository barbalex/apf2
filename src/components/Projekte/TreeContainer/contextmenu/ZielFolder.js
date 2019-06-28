import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'

// create objects outside render
const openLowerNodesData = {
  action: 'openLowerNodes',
}
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'ziel',
}

const ZielFolder = ({ onClick, treeName }) => {
  const { user } = useContext(storeContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}zielFolder`}>
        <div className="react-contextmenu-title">Ziele</div>
        <MenuItem onClick={onClick} data={openLowerNodesData}>
          alle öffnen
        </MenuItem>
        <MenuItem onClick={onClick} data={closeLowerNodesData}>
          alle schliessen
        </MenuItem>
        {!userIsReadOnly(user.token) && (
          <MenuItem onClick={onClick} data={insertData}>
            erstelle neues
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(ZielFolder)
