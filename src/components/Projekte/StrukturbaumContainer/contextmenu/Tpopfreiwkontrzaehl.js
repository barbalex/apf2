// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Tpopfreiwkontrzaehl = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopfreiwkontrzaehl" >
    <div className="react-contextmenu-title">Zählung</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfreiwkontrzaehl`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `tpopfreiwkontrzaehl`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Tpopfreiwkontrzaehl.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Tpopfreiwkontrzaehl
