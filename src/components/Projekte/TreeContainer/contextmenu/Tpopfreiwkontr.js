import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopfreiwkontr',
}
const deleteData = {
  action: 'delete',
  table: 'tpopfreiwkontr',
}
const markForMovingData = {
  action: 'markForMoving',
  table: 'tpopfreiwkontr',
}
const markForCopyingData = {
  action: 'markForCopying',
  table: 'tpopfreiwkontr',
}
const resetCopyingData = {
  action: 'resetCopying',
}

const Tpopfreiwkontr = ({ treeName, onClick }) => {
  const { copying, user } = useContext(storeContext)

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
        id={`${treeName}tpopfreiwkontr`}
        collect={(props) => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Freiwilligen-Kontrolle</div>
        {!userIsReadOnly(user.token, 'freiw') && (
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

export default observer(Tpopfreiwkontr)
