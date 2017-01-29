// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Tpopmassn = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopmassn" >
    <div className="react-contextmenu-title">Massnahme</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopmassn`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `tpopmassn`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Tpopmassn.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Tpopmassn
