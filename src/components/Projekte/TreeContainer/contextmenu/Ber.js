import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'ber',
}
const deleteData = {
  action: 'delete',
  table: 'ber',
}

const BerFolder = ({ treeName, onClick }) => {
  const { user } = useContext(storeContext)

  // eslint-disable-next-line no-unused-vars
  const [label, changeLabel] = useState('')

  const onShow = useCallback(event => changeLabel(event.detail.data.nodeLabel))

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${treeName}ber`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Bericht</div>
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

export default observer(BerFolder)
