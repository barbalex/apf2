import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'user',
}
const deleteData = {
  action: 'delete',
  table: 'user',
}

const User = ({ onClick, treeName }) => {
  const { user } = useContext(storeContext)

  const mayWrite = !userIsReadOnly(user.token)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}user`}>
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
