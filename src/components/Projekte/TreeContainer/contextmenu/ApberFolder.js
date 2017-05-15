// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ApberFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ContextMenu id={`${tree.name}apberFolder`}>
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
  </ContextMenu>
)

export default ApberFolder
