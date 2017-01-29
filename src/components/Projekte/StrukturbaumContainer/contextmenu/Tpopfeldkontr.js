// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Tpopfeldkontr = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopfeldkontr" >
    <div className="react-contextmenu-title">Feld-Kontrolle</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfeldkontr`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `tpopfeldkontr`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Tpopfeldkontr.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Tpopfeldkontr
