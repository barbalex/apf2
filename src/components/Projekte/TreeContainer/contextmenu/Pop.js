// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(
  inject('store'),
  withState('id', 'changeId', 0),
  withState('label', 'changeLabel', ''),
  withHandlers({
    // according to https://github.com/vkbansal/react-contextmenu/issues/65
    // this is how to pass data from ContextMenuTrigger to ContextMenu
    onShow: props => event => {
      props.changeId(event.detail.data.nodeId)
      props.changeLabel(event.detail.data.nodeLabel)
    },
  }),
  observer
)

const Pop = ({
  onClick,
  store,
  tree,
  changeId,
  id,
  changeLabel,
  label,
  onShow,
  token,
  moving,
  copying
}: {
  onClick: () => void,
  store: Object,
  tree: Object,
  changeId: () => {},
  id: number,
  changeLabel: () => void,
  label: string,
  onShow: () => void,
  token: String,
  moving: Object,
  copying: Object
}) => {
  const isMoving = moving.table && moving.table === 'tpop'
  const isCopying = copying.table && copying.table === 'tpop'

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${tree.name}pop`}
        collect={props => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">Population</div>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'openLowerNodes',
          }}
        >
          alle öffnen
        </MenuItem>
        {
          !userIsReadOnly(token) &&
          <Fragment>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'pop',
              }}
            >
              erstelle neue
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'pop',
              }}
            >
              lösche
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'markForMoving',
                table: 'pop',
              }}
            >
              verschiebe
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
            <MenuItem
              onClick={onClick}
              data={{
                action: 'markForCopying',
                table: 'pop',
              }}
            >
              kopiere
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'markForCopyingWithNextLevel',
                table: 'pop',
              }}
            >
              kopiere inklusive Teilpopulationen
            </MenuItem>
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
          </Fragment>
        }
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default enhance(Pop)
