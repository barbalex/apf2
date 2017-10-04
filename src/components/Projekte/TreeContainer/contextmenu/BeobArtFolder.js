// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const BeobArtFolder = ({
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
        table: 'beobArt',
      }}
    >
      erstelle neue
    </MenuItem>
  </ContextMenu>
)

export default BeobArtFolder
