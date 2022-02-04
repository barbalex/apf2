import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

// create objects outside render
const openLowerNodesData = {
  action: 'openLowerNodes',
}
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'tpopfreiwkontr',
}
const moveData = {
  action: 'move',
}
const copyData = {
  action: 'copy',
}
const resetCopyingData = {
  action: 'resetCopying',
}

const TpopfreiwkontrFolder = ({ onClick, treeName }) => {
  const { copying, user, moving } = useContext(storeContext)

  const isMoving = moving.table && moving.table === 'tpopfreiwkontr'
  const isCopying = copying.table && copying.table === 'tpopfreiwkontr'

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}tpopfreiwkontrFolder`} hideOnLeave={true}>
        <div className="react-contextmenu-title">Freiwilligen-Kontrollen</div>
        <MenuItem onClick={onClick} data={openLowerNodesData}>
          alle öffnen
        </MenuItem>
        <MenuItem onClick={onClick} data={closeLowerNodesData}>
          alle schliessen
        </MenuItem>
        {!userIsReadOnly(user.token, 'freiw') && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neue
            </MenuItem>
            {isMoving && (
              <MenuItem onClick={onClick} data={moveData}>
                {`verschiebe '${moving.label}' hierhin`}
              </MenuItem>
            )}
            {isCopying && (
              <MenuItem onClick={onClick} data={copyData}>
                {`kopiere '${copying.label}' hierhin`}
              </MenuItem>
            )}
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

export default observer(TpopfreiwkontrFolder)
