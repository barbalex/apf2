import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Apber = ({ onClick }) =>
  <ContextMenu id="apber" >
    <div className="react-contextmenu-title">AP-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `apber`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `apber`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Apber.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Apber
