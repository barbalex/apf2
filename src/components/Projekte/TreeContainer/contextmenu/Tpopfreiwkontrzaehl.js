import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopfreiwkontrzaehl',
}
const deleteData = {
  action: 'delete',
  table: 'tpopfreiwkontrzaehl',
}

const Tpopfreiwkontrzaehl = ({ treeName, onClick }) => {
  const { user } = useContext(storeContext)

  // eslint-disable-next-line no-unused-vars
  const [label, changeLabel] = useState('')

  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  const onShow = useCallback(
    (event) => changeLabel(event.detail.data.nodeLabel),
    [],
  )

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${treeName}tpopfreiwkontrzaehl`}
        collect={(props) => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Zählung</div>
        {!userIsReadOnly(user.token, 'freiw') && (
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

export default observer(Tpopfreiwkontrzaehl)
