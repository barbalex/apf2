import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Tpopber = ({ onClick }) =>
  <ContextMenu id="tpopber" >
    <div className="react-contextmenu-title">Kontroll-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopber`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `tpopber`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Tpopber.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Tpopber
