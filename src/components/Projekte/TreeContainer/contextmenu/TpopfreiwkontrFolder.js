// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(
  inject(`store`),
  observer
)

const TpopfreiwkontrFolder = (
  { store, onClick, treeName }:
  {store:Object,onClick:()=>void,treeName:string}
) => {
  const moving = store.moving.table && store.moving.table === `tpopfreiwkontr`
  const copying = store.copying.table && store.copying.table === `tpopfreiwkontr`

  return (
    <ContextMenu id={`${treeName}tpopfreiwkontrFolder`} >
      <div className="react-contextmenu-title">Freiwilligen-Kontrollen</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: `insert`,
          table: `tpopfreiwkontr`,
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
      {
        copying &&
        <MenuItem
          onClick={onClick}
          data={{
            action: `copy`,
          }}
        >
          {`kopiere '${store.copying.label}' hierhin`}
        </MenuItem>
      }
    </ContextMenu>
  )
}

TpopfreiwkontrFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default enhance(TpopfreiwkontrFolder)
