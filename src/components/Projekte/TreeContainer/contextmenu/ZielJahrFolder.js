import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

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

const ZielJahrFolder = ({ onClick, treeName }) => {
  const { user } = useContext(storeContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}zieljahrFolder`} hideOnLeave={true}>
        <div className="react-contextmenu-title">Ziele</div>
        <MenuItem onClick={onClick} data={openLowerNodesData}>
          alle öffnen
        </MenuItem>
        <MenuItem onClick={onClick} data={closeLowerNodesData}>
          alle schliessen
        </MenuItem>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neues
            </MenuItem>
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(ZielJahrFolder)
