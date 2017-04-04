// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Apber = (
  { onClick, treeName }:
  {onClick:()=>void,treeName:string}
) =>
  <ContextMenu id={treeName}>
    <div className="react-contextmenu-title">AP-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `apber`,
      }}
    >
      erstelle neuen
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `apber`,
      }}
    >
      lösche
    </MenuItem>
  </ContextMenu>

Apber.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Apber
