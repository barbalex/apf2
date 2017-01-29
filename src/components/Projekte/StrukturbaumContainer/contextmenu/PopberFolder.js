// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const PopberFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="popberFolder" >
    <div className="react-contextmenu-title">Kontroll-Berichte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `popber`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

PopberFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default PopberFolder
