// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

const enhance = compose(
  inject(`store`),
  observer
)

const Tpop = (
  { onClick, store, treeName }:
  {onClick:()=>void,store:Object,treeName:string}
) => {
  const movingTpopmassn = store.moving.table && store.moving.table === `tpopmassn`
  const copyingTpopmassn = store.copying.table && store.copying.table === `tpopmassn`
  const movingTpopfeldkontr = store.moving.table && store.moving.table === `tpopfeldkontr`
  const movingTpopfreiwkontr = store.moving.table && store.moving.table === `tpopfreiwkontr`

  return (
    <ContextMenu id={`${treeName}tpop`}>
      <div className="react-contextmenu-title">Teil-Population</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: `insert`,
          table: `tpop`,
        }}
      >
        erstelle neue
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: `delete`,
          actionTable: `tpop`,
          table: `tpop`,
        }}
      >
        lösche
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: `markForMoving`,
          table: `tpop`,
        }}
      >
        verschiebe
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: `localizeOnMap`,
          actionTable: `tpop`,
          idTable: `tpop`,
        }}
      >
        verorte auf Karte
      </MenuItem>
      {
        movingTpopmassn &&
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
        copyingTpopmassn &&
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
        movingTpopfeldkontr &&
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
        movingTpopfreiwkontr &&
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

Tpop.propTypes = {
  onClick: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
}

export default enhance(Tpop)
