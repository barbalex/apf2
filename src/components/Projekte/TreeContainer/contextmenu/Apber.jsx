import React, { useContext } from 'react'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

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
  const { user } = useContext(storeContext)
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
