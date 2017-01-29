// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Erfkrit = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="erfkrit" >
    <div className="react-contextmenu-title">AP-Erfolgskriterium</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `erfkrit`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `erfkrit`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Erfkrit.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Erfkrit
