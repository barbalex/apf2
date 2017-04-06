// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ErfkritFolder = (
  { onClick, tree }:
  {onClick:()=>void,tree:Object}
) =>
  <ContextMenu id={`${tree.name}erfkritFolder`} >
    <div className="react-contextmenu-title">AP-Erfolgskriterien</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `erfkrit`,
      }}
    >
      erstelle neues
    </MenuItem>
  </ContextMenu>

ErfkritFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ErfkritFolder
