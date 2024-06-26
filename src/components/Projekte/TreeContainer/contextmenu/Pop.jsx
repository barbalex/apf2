import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu/index.js'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext.js'
import ErrorBoundary from '../../../shared/ErrorBoundary.jsx'

// create objects outside render
const openLowerNodesData = {
  action: 'openLowerNodes',
}
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'pop',
}
const deleteData = {
  action: 'delete',
  table: 'pop',
}
const markForMovingData = {
  action: 'markForMoving',
  table: 'pop',
}
const moveHereData = {
  action: 'move',
}
const markForCopyingData = {
  action: 'markForCopying',
  table: 'pop',
}
const markForCopyingWithNextLevelData = {
  action: 'markForCopyingWithNextLevel',
  table: 'pop',
}
const copyData = {
  action: 'copy',
}
const resetCopyingData = {
  action: 'resetCopying',
}

const Pop = ({ onClick }) => {
  const { copying, user, moving } = useContext(storeContext)

  const isMoving = moving.table && moving.table === 'tpop'
  const isCopying = copying.table && copying.table === 'tpop'

  return (
    <ErrorBoundary>
      <ContextMenu id="treePop" hideOnLeave={true}>
        <div className="react-contextmenu-title">Population</div>
        <MenuItem onClick={onClick} data={openLowerNodesData}>
          alle öffnen
        </MenuItem>
        <MenuItem onClick={onClick} data={closeLowerNodesData}>
          alle schliessen
        </MenuItem>
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
            {isMoving && (
              <MenuItem onClick={onClick} data={moveHereData}>
                {`verschiebe '${moving.label}' hierhin`}
              </MenuItem>
            )}
            <MenuItem onClick={onClick} data={markForCopyingData}>
              kopiere
            </MenuItem>
            <MenuItem onClick={onClick} data={markForCopyingWithNextLevelData}>
              kopiere inklusive Teilpopulationen
            </MenuItem>
            {isCopying && (
              <MenuItem onClick={onClick} data={copyData}>
                {`kopiere '${copying.label}' hierhin`}
              </MenuItem>
            )}
            {isCopying && (
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

export default observer(Pop)
