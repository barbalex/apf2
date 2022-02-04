import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

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

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}tpopfeldkontr`}>
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
