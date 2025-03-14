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

export const TpopmassnFolder = memo(
  observer(({ onClick }) => {
    const { copying, user, moving } = useContext(MobxContext)

    const isMoving = moving.table && moving.table === 'tpopmassn'
    const isCopying = copying.table && copying.table === 'tpopmassn'

    return (
      <ErrorBoundary>
        <ContextMenu
          id="treeTpopmassnFolder"
          hideOnLeave={true}
        >
          <div className="react-contextmenu-title">Massnahmen</div>
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
              {copying.table && (
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
