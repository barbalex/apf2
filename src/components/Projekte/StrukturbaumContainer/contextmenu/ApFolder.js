// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Apfolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="apFolder" >
    <div className="react-contextmenu-title">Art</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `ap`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

Apfolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Apfolder
