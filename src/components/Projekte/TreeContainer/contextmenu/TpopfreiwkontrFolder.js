// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopfreiwkontrFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopfreiwkontrFolder" >
    <div className="react-contextmenu-title">Freiwilligen-Kontrollen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfreiwkontr`,
      }}
    >
      erstelle neue
    </MenuItem>
  </ContextMenu>

TpopfreiwkontrFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopfreiwkontrFolder
