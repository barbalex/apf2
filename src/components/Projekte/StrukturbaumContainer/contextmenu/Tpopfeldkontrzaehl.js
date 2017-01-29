// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Tpopfeldkontrzaehl = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopfeldkontrzaehl" >
    <div className="react-contextmenu-title">Zählung</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfeldkontrzaehl`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `tpopfeldkontrzaehl`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Tpopfeldkontrzaehl.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Tpopfeldkontrzaehl
