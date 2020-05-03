import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'

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

const Pop = ({ onClick, treeName }) => {
  const { copying, user, moving } = useContext(storeContext)

  // eslint-disable-next-line no-unused-vars
  const [id, changeId] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [label, changeLabel] = useState('')

  const isMoving = moving.table && moving.table === 'tpop'
  const isCopying = copying.table && copying.table === 'tpop'

  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  const onShow = useCallback((event) => {
    changeId(event.detail.data.nodeId)
    changeLabel(event.detail.data.nodeLabel)
  }, [])

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${treeName}pop`}
        collect={(props) => props}
        onShow={onShow}
      >
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
