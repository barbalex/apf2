import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

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
const moveData = {
  action: 'move',
}
const copyData = {
  action: 'copy',
}
const resetCopyingData = {
  action: 'resetCopying',
}

export const PopFolder = memo(
  observer(({ onClick }) => {
    const { copying, user, moving } = useContext(MobxContext)

    const isMoving = moving.table && moving.table === 'pop'
    const isCopying = copying.table && copying.table === 'pop'

    return (
      <ErrorBoundary>
        <ContextMenu
          id="treePopFolder"
          hideOnLeave={true}
        >
          <div className="react-contextmenu-title">Populationen</div>
          <MenuItem
            onClick={onClick}
            data={openLowerNodesData}
          >
            alle öffnen
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={closeLowerNodesData}
          >
            alle schliessen
          </MenuItem>
          {!userIsReadOnly(user.token) && (
            <>
              <MenuItem
                onClick={onClick}
                data={insertData}
              >
                erstelle neue
              </MenuItem>
              {isMoving && (
                <MenuItem
                  onClick={onClick}
                  data={moveData}
                >
                  {`verschiebe '${moving.label}' hierhin`}
                </MenuItem>
              )}
              {isCopying && (
                <MenuItem
                  onClick={onClick}
                  data={copyData}
                >
                  {`kopiere '${copying.label}' hierhin`}
                </MenuItem>
              )}
              {isCopying && (
                <MenuItem
                  onClick={onClick}
                  data={resetCopyingData}
                >
                  Kopieren aufheben
                </MenuItem>
              )}
            </>
          )}
        </ContextMenu>
      </ErrorBoundary>
    )
  }),
)
