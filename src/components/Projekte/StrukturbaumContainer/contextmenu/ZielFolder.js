// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ZielFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="zielFolder" >
    <div className="react-contextmenu-title">Ziele</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `ziel`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

ZielFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ZielFolder
