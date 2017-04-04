// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const PopmassnberFolder = (
  { onClick, treeName }:
  {onClick:()=>void,treeName:string}
) =>
  <ContextMenu id={treeName} >
    <div className="react-contextmenu-title">Massnahmen-Berichte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `popmassnber`,
      }}
    >
      erstelle neuen
    </MenuItem>
  </ContextMenu>

PopmassnberFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default PopmassnberFolder
