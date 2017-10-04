// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const BeobartFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ContextMenu id={`${tree.name}beobArtFolder`}>
    <div className="react-contextmenu-title">Art für Beobachtungen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'insert',
        table: 'beobart',
      }}
    >
      erstelle neue
    </MenuItem>
  </ContextMenu>
)

export default BeobartFolder
