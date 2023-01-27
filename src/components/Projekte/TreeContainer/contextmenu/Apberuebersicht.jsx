import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'apberuebersicht',
}
const deleteData = {
  action: 'delete',
  table: 'apberuebersicht',
}

const Apberuebersicht = ({ onClick }) => {
  const { user } = useContext(storeContext)

  return (
    <ErrorBoundary>
      <ContextMenu id="treeApberuebersicht" hideOnLeave={true}>
        <div className="react-contextmenu-title">AP-Bericht</div>
        {!userIsReadOnly(user.token) && (
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

export default observer(Apberuebersicht)
