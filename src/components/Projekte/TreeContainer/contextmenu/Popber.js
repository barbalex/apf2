import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'popber',
}
const deleteData = {
  action: 'delete',
  table: 'popber',
}

const Popber = ({ treeName, onClick }) => {
  const { user } = useContext(storeContext)
  // eslint-disable-next-line no-unused-vars
  const [label, changeLabel] = useState('')
  const onShow = useCallback(
    (event) => changeLabel(event.detail.data.nodeLabel),
    [],
  )

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${treeName}popber`}
        collect={(props) => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Kontroll-Bericht</div>
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

export default observer(Popber)
