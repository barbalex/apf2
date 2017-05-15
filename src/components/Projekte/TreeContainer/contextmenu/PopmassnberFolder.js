// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const PopmassnberFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ContextMenu id={`${tree.name}popmassnberFolder`}>
    <div className="react-contextmenu-title">Massnahmen-Berichte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'insert',
        table: 'popmassnber',
      }}
    >
      erstelle neuen
    </MenuItem>
  </ContextMenu>
)

export default PopmassnberFolder
