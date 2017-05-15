// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Apber = ({ onClick, tree }: { onClick: () => void, tree: Object }) => (
  <ContextMenu id={`${tree.name}apber`}>
    <div className="react-contextmenu-title">AP-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'insert',
        table: 'apber',
      }}
    >
      erstelle neuen
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'delete',
        table: 'apber',
      }}
    >
      lösche
    </MenuItem>
  </ContextMenu>
)

export default Apber
