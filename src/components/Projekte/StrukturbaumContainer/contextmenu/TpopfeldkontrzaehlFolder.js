import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopfeldkontrzaehlFolder = ({ onClick }) =>
  <ContextMenu id="tpopfeldkontrzaehlFolder" >
    <div className="react-contextmenu-title">Zählungen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfeldkontrzaehl`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

TpopfeldkontrzaehlFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopfeldkontrzaehlFolder
