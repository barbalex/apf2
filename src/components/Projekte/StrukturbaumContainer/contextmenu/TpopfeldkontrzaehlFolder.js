// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopfeldkontrzaehlFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopfeldkontrzaehlFolder" >
    <div className="react-contextmenu-title">Zählungen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfeldkontrzaehl`,
      }}
    >
      erstelle neue
    </MenuItem>
  </ContextMenu>

TpopfeldkontrzaehlFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopfeldkontrzaehlFolder
