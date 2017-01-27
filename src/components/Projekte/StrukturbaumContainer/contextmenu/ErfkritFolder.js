import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ErfkritFolder = ({ onClick }) =>
  <ContextMenu id="erfkritFolder" >
    <div className="react-contextmenu-title">AP-Erfolgskriterien</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `erfkrit`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

ErfkritFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ErfkritFolder
