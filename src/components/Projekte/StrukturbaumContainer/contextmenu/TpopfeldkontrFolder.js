import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopfeldkontrFolder = ({ onClick }) =>
  <ContextMenu id="tpopfeldkontrFolder" >
    <div className="react-contextmenu-title">Feld-Kontrollen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfeldkontr`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

TpopfeldkontrFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopfeldkontrFolder
