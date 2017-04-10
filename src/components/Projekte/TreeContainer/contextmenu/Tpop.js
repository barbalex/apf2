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
  { onClick, store, tree }:
  {onClick:()=>void,store:Object,tree:Object}
) => {
  const moving = store.moving.table && [`tpopmassn`, `tpopfeldkontr`, `tpopfreiwkontr`].includes(store.moving.table)
  const copying = store.copying.table && [`tpopmassn`, `tpopfeldkontr`, `tpopfreiwkontr`].includes(store.copying.table)

  return (
    <ContextMenu id={`${tree.name}tpop`}>
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
      {
        tree.name === `tree` &&
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
      }
      <MenuItem
        onClick={onClick}
        data={{
          action: `markForMoving`,
          table: `tpop`,
        }}
      >
        verschiebe
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
      <MenuItem
        onClick={onClick}
        data={{
          action: `markForCopying`,
          table: `tpop`,
        }}
      >
        kopiere
      </MenuItem>
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
        copying &&
        <MenuItem
          onClick={onClick}
          data={{
            action: `resetCopying`,
          }}
        >
          Kopieren aufheben
        </MenuItem>
      }
      <MenuItem
        onClick={onClick}
        data={{
          action: `copyTpopKoordToPop`,
        }}
      >
        Kopiere Koordinaten in die Population
      </MenuItem>
    </ContextMenu>
  )
}

Tpop.propTypes = {
  onClick: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
}

export default enhance(Tpop)
