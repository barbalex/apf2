import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'erfkrit',
}
const deleteData = {
  action: 'delete',
  table: 'erfkrit',
}

const Erfkrit = ({ treeName, onClick }) => {
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
        id={`${treeName}erfkrit`}
        collect={(props) => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">AP-Erfolgskriterium</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neues
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

export default observer(Erfkrit)
