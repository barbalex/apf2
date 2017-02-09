// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ZielJahrFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="zieljahr" >
    <div className="react-contextmenu-title">Ziele</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `ziel`,
      }}
    >
      erstelle neues
    </MenuItem>
  </ContextMenu>

ZielJahrFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ZielJahrFolder
