import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'
import ErrorBoundary from 'react-error-boundary'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopmassn',
}
const deleteData = {
  action: 'delete',
  table: 'tpopmassn',
}
const markForMovingData = {
  action: 'markForMoving',
  table: 'tpopmassn',
}
const markForCopyingData = {
  action: 'markForCopying',
  table: 'tpopmassn',
}
const resetCopyingData = {
  action: 'resetCopying',
}

const Tpopmassn = ({ treeName, onClick }) => {
  const { copying, user } = useContext(storeContext)

  // eslint-disable-next-line no-unused-vars
  const [label, changeLabel] = useState('')

  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  const onShow = useCallback(event => changeLabel(event.detail.data.nodeLabel))

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${treeName}tpopmassn`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Massnahme</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neue
            </MenuItem>
            <MenuItem onClick={onClick} data={deleteData}>
              lösche
            </MenuItem>
            <MenuItem onClick={onClick} data={markForMovingData}>
              verschiebe
            </MenuItem>
            <MenuItem onClick={onClick} data={markForCopyingData}>
              kopiere
            </MenuItem>
            {copying.table && (
              <MenuItem onClick={onClick} data={resetCopyingData}>
                Kopieren aufheben
              </MenuItem>
            )}
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(Tpopmassn)
