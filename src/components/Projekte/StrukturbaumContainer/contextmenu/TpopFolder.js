// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopFolder" >
    <div className="react-contextmenu-title">Teil-Populationen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpop`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `karte`,
        actionTable: `tpop`,
        idTable: `pop`
      }}
    >
      auf Karte zeigen
    </MenuItem>
  </ContextMenu>

TpopFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopFolder
