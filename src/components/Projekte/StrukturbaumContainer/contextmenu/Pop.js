import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Pop = ({ onClick }) =>
  <ContextMenu id="pop" >
    <div className="react-contextmenu-title">Population</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `pop`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `pop`,
      }}
    >
      löschen
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `karte`,
        actionTable: `pop`,
        idTable: `pop`,
      }}
    >
      auf Karte zeigen
    </MenuItem>
  </ContextMenu>

Pop.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Pop
