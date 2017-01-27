import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const PopFolder = ({ onClick }) =>
  <ContextMenu id="popFolder" >
    <div className="react-contextmenu-title">Populationen</div>
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
        action: `karte`,
        actionTable: `pop`,
        idTable: `ap`,
      }}
    >
      auf Karte zeigen
    </MenuItem>
  </ContextMenu>

PopFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default PopFolder
