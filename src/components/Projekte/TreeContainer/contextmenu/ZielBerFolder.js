// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ZielBerFolder = (
  { onClick, tree }:
  {onClick:()=>void,tree:Object}
) =>
  <ContextMenu id={`${tree.name}zielberFolder`} >
    <div className="react-contextmenu-title">Berichte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `zielber`,
      }}
    >
      erstelle neuen
    </MenuItem>
  </ContextMenu>

ZielBerFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ZielBerFolder
