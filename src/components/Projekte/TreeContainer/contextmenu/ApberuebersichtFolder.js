// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ApberuebersichtFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ContextMenu id={`${tree.name}apberuebersichtFolder`}>
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
  </ContextMenu>
)

export default ApberuebersichtFolder
