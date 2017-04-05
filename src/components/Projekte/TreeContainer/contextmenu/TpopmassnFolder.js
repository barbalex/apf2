// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(
  inject(`store`),
  observer
)

const TpopmassnFolder = (
  { store, onClick, treeName }:
  {store:Object,onClick:()=>void,treeName:string}
) => {
  const moving = store.moving.table && store.moving.table === `tpopmassn`

  return (
    <ContextMenu id={`${treeName}tpopmassnFolder`} >
      <div className="react-contextmenu-title">Massnahmen</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: `insert`,
          table: `tpopmassn`,
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

TpopmassnFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default enhance(TpopmassnFolder)
