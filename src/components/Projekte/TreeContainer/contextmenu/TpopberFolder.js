import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu'

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
