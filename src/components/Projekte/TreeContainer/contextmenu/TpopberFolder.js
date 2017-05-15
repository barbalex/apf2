// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopberFolder = ({
  onClick,
  tree,
}: {
  onClick: () => void,
  tree: Object,
}) => (
  <ContextMenu id={`${tree.name}tpopberFolder`}>
    <div className="react-contextmenu-title">Kontroll-Berichte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: 'insert',
        table: 'tpopber',
      }}
    >
      erstelle neuen
    </MenuItem>
  </ContextMenu>
)

export default TpopberFolder
