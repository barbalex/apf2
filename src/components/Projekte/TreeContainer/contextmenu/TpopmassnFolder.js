// @flow
import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'tpopmassn',
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

const TpopmassnFolder = ({
  treeName,
  onClick,
}: {
  treeName: string,
  onClick: () => void,
}) => {
  const { copying, user, moving } = useContext(mobxStoreContext)

  const isMoving = moving.table && moving.table === 'tpopmassn'
  const isCopying = copying.table && copying.table === 'tpopmassn'

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}tpopmassnFolder`}>
        <div className="react-contextmenu-title">Massnahmen</div>
        {!userIsReadOnly(user.token) && (
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

export default observer(TpopmassnFolder)
