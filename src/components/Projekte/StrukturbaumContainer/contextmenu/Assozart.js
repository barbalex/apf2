// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const AssozartFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="assozart" >
    <div className="react-contextmenu-title">assoziierte Art</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `assozart`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `assozart`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

AssozartFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default AssozartFolder
