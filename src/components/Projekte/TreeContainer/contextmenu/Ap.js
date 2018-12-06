// @flow
import React, { Fragment, useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

// create objects outside render
const closeLowerNodesData = {
  action: 'closeLowerNodes',
}
const insertData = {
  action: 'insert',
  table: 'ap',
}
const deleteData = {
  action: 'delete',
  table: 'ap',
}
const moveData = {
  action: 'move',
}
const togglePopTooltipData = {
  action: 'toggleTooltip',
  actionTable: 'pop',
}
const toggleTpopTooltipData = {
  action: 'toggleTooltip',
  actionTable: 'tpop',
}

const Ap = ({
  onClick,
  treeName,
}: {
  onClick: () => void,
  treeName: string,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const {
    activeApfloraLayers,
    popLabelUsingNr,
    tpopLabelUsingNr,
    user,
    moving,
  } = mobxStore

  const isMoving = moving.table && moving.table === 'pop'
  const mayWrite = !userIsReadOnly(user.token)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}ap`}>
        <div className="react-contextmenu-title">Aktionsplan</div>
        <MenuItem onClick={onClick} data={closeLowerNodesData}>
          alle schliessen
        </MenuItem>
        {mayWrite && (
          <Fragment>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neuen
            </MenuItem>
            <MenuItem onClick={onClick} data={deleteData}>
              lösche
            </MenuItem>
          </Fragment>
        )}
        {isMoving && (
          <MenuItem onClick={onClick} data={moveData}>
            {`verschiebe '${moving.label}' hierhin`}
          </MenuItem>
        )}
        {(activeApfloraLayers.includes('pop') ||
          activeApfloraLayers.includes('tpop')) && (
          <div>
            <div className="react-contextmenu-divider" />
            <div className="react-contextmenu-title">Karte</div>
          </div>
        )}
        {activeApfloraLayers.includes('pop') && (
          <MenuItem onClick={onClick} data={togglePopTooltipData}>
            {popLabelUsingNr
              ? 'beschrifte Populationen mit Namen'
              : 'beschrifte Populationen mit Nummer'}
          </MenuItem>
        )}
        {activeApfloraLayers.includes('tpop') && (
          <MenuItem onClick={onClick} data={toggleTpopTooltipData}>
            {tpopLabelUsingNr
              ? 'beschrifte Teil-Populationen mit Namen'
              : 'beschrifte Teil-Populationen mit Nummer'}
          </MenuItem>
        )}
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(Ap)
