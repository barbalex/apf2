import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopber',
}

const TpopberFolder = ({ onClick, treeName }) => {
  const { user } = useContext(storeContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}tpopberFolder`}>
        <div className="react-contextmenu-title">Kontroll-Berichte</div>
        {!userIsReadOnly(user.token) && (
          <MenuItem onClick={onClick} data={insertData}>
            erstelle neuen
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(TpopberFolder)
