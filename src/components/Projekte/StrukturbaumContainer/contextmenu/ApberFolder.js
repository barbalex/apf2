// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ApberFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="apberFolder" >
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
  </ContextMenu>

ApberFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ApberFolder
