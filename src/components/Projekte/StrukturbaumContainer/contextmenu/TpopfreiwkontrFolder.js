import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopfreiwkontrFolder = ({ onClick }) =>
  <ContextMenu id="tpopfreiwkontrFolder" >
    <div className="react-contextmenu-title" style={{ width: `195px` }}>Freiwilligen-Kontrollen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfreiwkontr`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

TpopfreiwkontrFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopfreiwkontrFolder
