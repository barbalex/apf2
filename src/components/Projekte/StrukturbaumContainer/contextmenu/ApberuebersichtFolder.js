// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ApberuebersichtFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="apberuebersichtFolder" >
    <div className="react-contextmenu-title">AP-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `apberuebersicht`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

ApberuebersichtFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ApberuebersichtFolder
