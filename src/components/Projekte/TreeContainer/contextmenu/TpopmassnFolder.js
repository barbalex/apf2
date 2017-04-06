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
  { store, onClick, tree }:
  {store:Object,tree:Object,onClick:()=>void}
) => {
  const moving = store.moving.table && store.moving.table === `tpopmassn`
  const copying = store.copying.table && store.copying.table === `tpopmassn`

  return (
    <ContextMenu id={`${tree.name}tpopmassnFolder`} >
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
      {
        store.copying.table &&
        <MenuItem
          onClick={onClick}
          data={{
            action: `resetCopying`,
          }}
        >
          Kopieren aufheben
        </MenuItem>
      }
    </ContextMenu>
  )
}

TpopmassnFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default enhance(TpopmassnFolder)
