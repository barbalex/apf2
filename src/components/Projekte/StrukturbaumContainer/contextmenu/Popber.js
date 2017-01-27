import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Popber = ({ onClick }) =>
  <ContextMenu id="popber" >
    <div className="react-contextmenu-title">Kontroll-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `popber`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `popber`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Popber.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Popber
