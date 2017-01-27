import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Ziel = ({ onClick }) =>
  <ContextMenu id="ziel" >
    <div className="react-contextmenu-title">Ziel</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `ziel`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `ziel`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Ziel.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Ziel
