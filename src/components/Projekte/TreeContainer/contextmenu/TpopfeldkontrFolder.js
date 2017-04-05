// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(
  inject(`store`),
  observer
)

const TpopfeldkontrFolder = (
  { store, onClick, treeName }:
  {store:Object,onClick:()=>void,treeName:string}
) => {
  const moving = store.moving.table && store.moving.table === `tpopfeldkontr`

  return (
    <ContextMenu id={`${treeName}tpopfeldkontrFolder`} >
      <div className="react-contextmenu-title">Feld-Kontrollen</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: `insert`,
          table: `tpopfeldkontr`,
        }}
      >
        erstelle neue
      </MenuItem>
      {
        moving &&
        <MenuItem
          onClick={onClick}
          data={{
            action: `move`,
          }}
        >
          {`verschiebe '${store.moving.label}' hierhin`}
        </MenuItem>
      }
    </ContextMenu>
  )
}

TpopfeldkontrFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default enhance(TpopfeldkontrFolder)
