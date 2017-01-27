import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Zielber = ({ onClick }) =>
  <ContextMenu id="zielber" >
    <div className="react-contextmenu-title">Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `zielber`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `zielber`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Zielber.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Zielber
