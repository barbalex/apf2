// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const Tpop = ({
  onClick,
  tree,
  token,
  moving,
  copying,
}: {
  onClick: () => void,
  tree: Object,
  token: String,
  moving: Object,
  copying: Object,
}) => {
  const isMoving =
    moving.table &&
    ['tpopmassn', 'tpopfeldkontr', 'tpopfreiwkontr'].includes(moving.table)
  const isCopying =
    copying.table &&
    ['tpopmassn', 'tpopfeldkontr', 'tpopfreiwkontr'].includes(copying.table)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}tpop`}>
        <div className="react-contextmenu-title">Teil-Population</div>
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
        {!userIsReadOnly(token) && (
          <Fragment>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'insert',
                table: 'tpop',
              }}
            >
              erstelle neue
            </MenuItem>
            <MenuItem
              onClick={onClick}
              data={{
                action: 'delete',
                actionTable: 'tpop',
                table: 'tpop',
              }}
            >
              lösche
            </MenuItem>
            {tree.name === 'tree' && (
              <MenuItem
                onClick={onClick}
                data={{
                  action: 'localizeOnMap',
                  actionTable: 'tpop',
                  idTable: 'tpop',
                }}
              >
                verorte auf Karte (mit Doppel-Klick)
              </MenuItem>
            )}
            <MenuItem
              onClick={onClick}
              data={{
                action: 'markForMoving',
                table: 'tpop',
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
                table: 'tpop',
              }}
            >
              kopiere
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
            <MenuItem
              onClick={onClick}
              data={{
                action: 'copyTpopKoordToPop',
              }}
            >
              Kopiere Koordinaten in die Population
            </MenuItem>
          </Fragment>
        )}
        <MenuItem
          onClick={onClick}
          data={{
            action: 'showCoordOfTpopOnMapsZhCh',
          }}
        >
          Zeige auf maps.zh.ch
        </MenuItem>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'showCoordOfTpopOnMapGeoAdminCh',
          }}
        >
          Zeige auf map.geo.admin.ch
        </MenuItem>
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default Tpop
