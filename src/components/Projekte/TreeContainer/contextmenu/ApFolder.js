// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Apfolder = (
  { onClick, treeName }:
  {onClick:()=>void,treeName:string}
) =>
  <ContextMenu id={`${treeName}apFolder`} >
    <div className="react-contextmenu-title">Art</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `ap`,
      }}
    >
      erstelle neue
    </MenuItem>
  </ContextMenu>

Apfolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Apfolder
