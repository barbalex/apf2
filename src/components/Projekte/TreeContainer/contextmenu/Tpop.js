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
  { onClick, store }:
  {onClick:()=>void,store:Object}
) =>
  <ContextMenu id="tpop">
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
        action: `localizeOnMap`,
        actionTable: `tpop`,
        idTable: `tpop`,
      }}
    >
      verorte auf Karte
    </MenuItem>
  </ContextMenu>

Tpop.propTypes = {
  onClick: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
}

export default enhance(Tpop)
