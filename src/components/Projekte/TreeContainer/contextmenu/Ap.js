// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(inject('store'), observer)

const Ap = ({
  onClick,
  store,
  tree,
  token,
  moving,
  activeApfloraLayers,
}: {
  onClick: () => void,
  store: Object,
  tree: Object,
  token: String,
  moving: Object,
  activeApfloraLayers: Array<String>,
}) => {
  const isMoving = moving.table && moving.table === 'pop'
  const mayWrite = !userIsReadOnly(token)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}ap`}>
        <div className="react-contextmenu-title">Aktionsplan</div>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'closeLowerNodes',
          }}
        >
          alle schliessen
        </MenuItem>
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
        {(activeApfloraLayers.includes('Pop') ||
          activeApfloraLayers.includes('Tpop')) && (
          <div>
            <div className="react-contextmenu-divider" />
            <div className="react-contextmenu-title">Karte</div>
          </div>
        )}
        {activeApfloraLayers.includes('Pop') && (
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
        {activeApfloraLayers.includes('Tpop') && (
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
