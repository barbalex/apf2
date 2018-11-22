// @flow
import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const TpopfeldkontrFolder = ({
  onClick,
  tree,
}: {
  tree: Object,
  onClick: () => void,
}) => {
  const { copying, user, moving } = useContext(mobxStoreContext)

  const isMoving = moving.table && moving.table === 'tpopfeldkontr'
  const isCopying = copying.table && copying.table === 'tpopfeldkontr'

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}tpopfeldkontrFolder`}>
        <div className="react-contextmenu-title">Feld-Kontrollen</div>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'openLowerNodes',
          }}
        >
          alle öffnen
        </MenuItem>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'closeLowerNodes',
          }}
        >
          alle schliessen
        </MenuItem>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'tpopfeldkontr',
              }}
            >
              erstelle neue
            </MenuItem>
            {isMoving && (
              <MenuItem
                onClick={onClick}
                data={{
                  action: 'move',
                }}
              >
                {`verschiebe '${moving.label}' hierhin`}
              </MenuItem>
            )}
            {isCopying && (
              <MenuItem
                onClick={onClick}
                data={{
                  action: 'copy',
                }}
              >
                {`kopiere '${copying.label}' hierhin`}
              </MenuItem>
            )}
            {copying.table && (
              <MenuItem
                onClick={onClick}
                data={{
                  action: 'resetCopying',
                }}
              >
                Kopieren aufheben
              </MenuItem>
            )}
          </>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(TpopfeldkontrFolder)
