// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(inject('store'), observer)

const Ap = ({
  onClick,
  store,
  tree,
}: {
  onClick: () => void,
  store: Object,
  tree: Object,
}) => {
  const moving = store.moving.table && store.moving.table === 'pop'
  const mayWrite = !store.user.readOnly

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}ap`}>
        <div className="react-contextmenu-title">Aktionsplan</div>
        {
          mayWrite &&
          <Fragment>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'ap',
              }}
            >
              erstelle neuen
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                table: 'ap',
              }}
            >
              lösche
            </MenuItem>
          </Fragment>
        }
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
        {(store.map.activeApfloraLayers.includes('Pop') ||
          store.map.activeApfloraLayers.includes('Tpop')) && (
          <div>
            <div className="react-contextmenu-divider" />
            <div className="react-contextmenu-title">Karte</div>
          </div>
        )}
        {store.map.activeApfloraLayers.includes('Pop') && (
          <MenuItem
            onClick={onClick}
            data={{
              action: 'toggleTooltip',
              actionTable: 'pop',
            }}
          >
            {store.map.pop.labelUsingNr
              ? 'beschrifte Populationen mit Namen'
              : 'beschrifte Populationen mit Nummer'}
          </MenuItem>
        )}
        {store.map.activeApfloraLayers.includes('Tpop') && (
          <MenuItem
            onClick={onClick}
            data={{
              action: 'toggleTooltip',
              actionTable: 'tpop',
            }}
          >
            {store.map.tpop.labelUsingNr
              ? 'beschrifte Teil-Populationen mit Namen'
              : 'beschrifte Teil-Populationen mit Nummer'}
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default enhance(Ap)
