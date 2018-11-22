// @flow
import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const enhance = compose(observer)

const TpopFolder = ({
  tree,
  onClick,
  moving,
}: {
  tree: Object,
  onClick: () => void,
  moving: Object,
}) => {
  const { copying, user } = useContext(mobxStoreContext)

  // eslint-disable-next-line no-unused-vars
  const [id, changeId] = useState(0)

  const isMoving = moving.table && moving.table === 'tpop'
  const isCopying = copying.table && copying.table === 'tpop'

  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  const onShow = useCallback(event => changeId(event.detail.data.nodeId))

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${tree.name}tpopFolder`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Teil-Populationen</div>
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
                table: 'tpop',
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
            {isCopying && (
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

export default enhance(TpopFolder)
