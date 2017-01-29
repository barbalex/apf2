// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Tpopfreiwkontr = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopfreiwkontr" >
    <div className="react-contextmenu-title" style={{ width: `190px` }}>Freiwilligen-Kontrolle</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfreiwkontr`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `tpopfreiwkontr`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Tpopfreiwkontr.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Tpopfreiwkontr
