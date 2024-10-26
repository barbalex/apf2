import React, { useContext } from 'react'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import { StoreContext } from '../../../../storeContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu/index.js'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'apber',
}
const deleteData = {
  action: 'delete',
  table: 'apber',
}

const Apber = ({ onClick }) => {
  const { user } = useContext(StoreContext)
  const isReadOnly = userIsReadOnly(user.token)

  return (
    <ErrorBoundary>
      <ContextMenu id="treeApber" hideOnLeave={true}>
        <div className="react-contextmenu-title">AP-Bericht</div>
        {!isReadOnly && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neuen
            </MenuItem>
            <MenuItem onClick={onClick} data={deleteData}>
              lösche
            </MenuItem>
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default Apber
