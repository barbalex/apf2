// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(inject('store'), observer)

const TpopfeldkontrFolder = ({
  store,
  onClick,
  tree,
}: {
  store: Object,
  tree: Object,
  onClick: () => void,
}) => {
  const moving = store.moving.table && store.moving.table === 'tpopfeldkontr'
  const copying = store.copying.table && store.copying.table === 'tpopfeldkontr'

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}tpopfeldkontrFolder`}>
        <div className="react-contextmenu-title">Feld-Kontrollen</div>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'tpopfeldkontr',
          }}
        >
          erstelle neue
        </MenuItem>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'openLowerNodes',
          }}
        >
          alle öffnen
        </MenuItem>
        {moving && (
          <MenuItem
            onClick={onClick}
            data={{
              action: 'move',
            }}
          >
            {`verschiebe '${store.moving.label}' hierhin`}
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
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default enhance(TpopfeldkontrFolder)
