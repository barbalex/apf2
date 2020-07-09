import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'apart',
}

const ApartFolder = ({ onClick, treeName }) => {
  const { user } = useContext(storeContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}apartFolder`}>
        <div className="react-contextmenu-title">AP-Arten</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neue
            </MenuItem>
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(ApartFolder)
