// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopfreiwkontrzaehlFolder = (
  {
    onClick,
    tree,
  }:
  {
    onClick: () => void,
    tree: Object,
  }
) =>
  <ContextMenu id={`${tree.name}tpopfreiwkontrzaehlFolder`} >
    <div className="react-contextmenu-title">Zählungen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfreiwkontrzaehl`,
      }}
    >
      erstelle neue
    </MenuItem>
  </ContextMenu>

export default TpopfreiwkontrzaehlFolder
