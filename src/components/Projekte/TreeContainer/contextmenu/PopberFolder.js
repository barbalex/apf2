// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const PopberFolder = (
  { onClick, treeName }:
  {onClick:()=>void,treeName:string}
) =>
  <ContextMenu
    // id="popberfolder"
    id={`${treeName}popberFolder`}
    // id={treeName}
  >
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
