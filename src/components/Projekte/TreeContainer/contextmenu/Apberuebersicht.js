// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Apberuebersicht = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ContextMenu id={`${tree.name}apberuebersicht`}>
    <div className="react-contextmenu-title">AP-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'insert',
        table: 'apberuebersicht',
      }}
    >
      erstelle neuen
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'delete',
        table: 'apberuebersicht',
      }}
    >
      lösche
    </MenuItem>
  </ContextMenu>
)

export default Apberuebersicht
