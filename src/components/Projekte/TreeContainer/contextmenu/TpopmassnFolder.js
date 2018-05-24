// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(inject('store'), observer)

const TpopmassnFolder = ({
  store,
  tree,
  onClick,
  token,
  moving
}: {
  store: Object,
  tree: Object,
  onClick: () => void,
  token: String,
  moving: Object
}) => {
  const isMoving = moving.table && moving.table === 'tpopmassn'
  const copying = store.copying.table && store.copying.table === 'tpopmassn'

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}tpopmassnFolder`}>
        <div className="react-contextmenu-title">Massnahmen</div>
        {
          !userIsReadOnly(token) &&
          <Fragment>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'tpopmassn',
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
            {copying && (
              <MenuItem
                onClick={onClick}
                data={{
                  action: 'copy',
                }}
              >
                {`kopiere '${store.copying.label}' hierhin`}
              </MenuItem>
            )}
            {store.copying.table && (
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

export default enhance(TpopmassnFolder)
