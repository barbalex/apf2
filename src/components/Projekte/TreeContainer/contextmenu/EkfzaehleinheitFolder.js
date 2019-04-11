import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'ekfzaehleinheit',
}

const EkfzaehleinheitFolder = ({ onClick, treeName }) => {
  const { user } = useContext(storeContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}ekfzaehleinheitFolder`}>
        <div className="react-contextmenu-title">EKF-Zähleinheit</div>
        {!userIsReadOnly(user.token) && (
          <MenuItem onClick={onClick} data={insertData}>
            erstelle neue
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(EkfzaehleinheitFolder)
