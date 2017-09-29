// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ZielJahrFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ContextMenu id={`${tree.name}zieljahr`}>
    <div className="react-contextmenu-title">Ziele</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'insert',
        table: 'ziel',
      }}
    >
      erstelle neues
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'openLowerNodes',
      }}
    >
      alle öffnen
    </MenuItem>
  </ContextMenu>
)

export default ZielJahrFolder
