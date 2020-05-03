import React, { useContext, useCallback, useState } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopfeldkontr',
}
const deleteData = {
  action: 'delete',
  table: 'tpopfeldkontr',
}
const markForMovingData = {
  action: 'markForMoving',
  table: 'tpopfeldkontr',
}
const markForCopyingData = {
  action: 'markForCopying',
  table: 'tpopfeldkontr',
}
const resetCopyingData = {
  action: 'resetCopying',
}
const markForCopyingBiotopData = {
  action: 'markForCopyingBiotop',
  table: 'tpopfeldkontr',
}
const copyBiotopData = {
  action: 'copyBiotop',
}
const resetCopyingBiotopData = {
  action: 'resetCopyingBiotop',
}

const Tpopfeldkontr = ({ treeName, onClick }) => {
  const { copying, user, copyingBiotop } = useContext(storeContext)

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
        id={`${treeName}tpopfeldkontr`}
        collect={(props) => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Feld-Kontrolle</div>
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
            <MenuItem onClick={onClick} data={markForCopyingBiotopData}>
              kopiere Biotop
            </MenuItem>
            {copyingBiotop.label && (
              <>
                <MenuItem onClick={onClick} data={copyBiotopData}>
                  {`kopiere Biotop von '${copyingBiotop.label}' hierhin`}
                </MenuItem>
                <MenuItem onClick={onClick} data={resetCopyingBiotopData}>
                  Biotop Kopieren aufheben
                </MenuItem>
              </>
            )}
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(Tpopfeldkontr)
