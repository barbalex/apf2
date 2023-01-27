import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'user',
}
const deleteData = {
  action: 'delete',
  table: 'user',
}

const User = ({ onClick }) => {
  const { user } = useContext(storeContext)

  const mayWrite = !userIsReadOnly(user.token)

  return (
    <ErrorBoundary>
      <ContextMenu id="treeUser" hideOnLeave={true}>
        <div className="react-contextmenu-title">Benutzer</div>
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
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(User)
