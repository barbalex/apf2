// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const BerFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ContextMenu id={`${tree.name}berFolder`}>
    <div className="react-contextmenu-title">Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'insert',
        table: 'ber',
      }}
    >
      erstelle neuen
    </MenuItem>
  </ContextMenu>
)

export default BerFolder
