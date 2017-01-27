import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Projekt = ({ onClick }) =>
  <ContextMenu id="projekt" >
    <div className="react-contextmenu-title">Projekt</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `karte`,
        actionTable: `ap`,
        idTable: `projekt`,
      }}
    >
      auf Karte zeigen
    </MenuItem>
  </ContextMenu>

Projekt.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Projekt
