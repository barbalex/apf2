// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Apberuebersicht = (
  { onClick }:
  {onClick:()=>void}
) =>
  <ContextMenu id="apberuebersicht">
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
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `apberuebersicht`,
      }}
    >
      lösche
    </MenuItem>
  </ContextMenu>

Apberuebersicht.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Apberuebersicht
