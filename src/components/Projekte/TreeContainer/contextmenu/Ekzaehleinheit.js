import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'ekzaehleinheit',
}
const deleteData = {
  action: 'delete',
  table: 'ekzaehleinheit',
}

const EkzaehleinheitFolder = ({ onClick, treeName }) => {
  const { user } = useContext(storeContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}ekzaehleinheit`}>
        <div className="react-contextmenu-title">EK-Zähleinheit</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neue
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

export default observer(EkzaehleinheitFolder)
