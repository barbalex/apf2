// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const PopberFolder = (
  { onClick, tree }:
  {onClick:()=>void,tree:Object}
) =>
  <ContextMenu id={`${tree.name}popberFolder`}>
    <div className="react-contextmenu-title">Kontroll-Berichte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `popber`,
      }}
    >
      erstelle neuen
    </MenuItem>
  </ContextMenu>

PopberFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default PopberFolder
