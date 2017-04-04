// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ApberuebersichtFolder = (
  { onClick, treeName }:
  {onClick:()=>void,treeName:string}
) =>
  <ContextMenu id={`${treeName}apberuebersichtFolder`} >
    <div className="react-contextmenu-title">AP-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `apberuebersicht`,
      }}
    >
      erstelle neuen
    </MenuItem>
  </ContextMenu>

ApberuebersichtFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ApberuebersichtFolder
