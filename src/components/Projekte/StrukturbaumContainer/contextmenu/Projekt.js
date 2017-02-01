// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Projekt = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="projekt" >
    <div className="react-contextmenu-title">Projekt</div>
    <MenuItem
      disabled
      onClick={onClick}
      data={{
        action: `karte`,
        actionTable: `ap`,
        idTable: `projekt`,
      }}
    >
      Populationen auf Karte zeigen
    </MenuItem>
  </ContextMenu>

Projekt.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Projekt
