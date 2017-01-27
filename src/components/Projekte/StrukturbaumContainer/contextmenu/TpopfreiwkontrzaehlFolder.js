import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopfreiwkontrzaehlFolder = ({ onClick }) =>
  <ContextMenu id="tpopfreiwkontrzaehlFolder" >
    <div className="react-contextmenu-title">Zählungen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfreiwkontrzaehl`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

TpopfreiwkontrzaehlFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopfreiwkontrzaehlFolder
