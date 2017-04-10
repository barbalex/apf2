// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Apfolder = (
  {
    onClick,
    tree,
  }:
  {
    onClick: () => void,
    tree: Object,
  }
) =>
  <ContextMenu id={`${tree.name}apFolder`} >
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

export default Apfolder
