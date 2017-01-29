// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const BerFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="ber" >
    <div className="react-contextmenu-title">Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `ber`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `ber`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

BerFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default BerFolder
