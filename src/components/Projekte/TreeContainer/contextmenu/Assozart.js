// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const AssozartFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ContextMenu id={`${tree.name}assozart`}>
    <div className="react-contextmenu-title">assoziierte Art</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'insert',
        table: 'assozart',
      }}
    >
      erstelle neue
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'delete',
        table: 'assozart',
      }}
    >
      lösche
    </MenuItem>
  </ContextMenu>
)

export default AssozartFolder
