// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopmassnFolder = (
  { onClick, treeName }:
  {onClick:()=>void,treeName:string}
) =>
  <ContextMenu id={`${treeName}tpopmassnFolder`} >
    <div className="react-contextmenu-title">Massnahmen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopmassn`,
      }}
    >
      erstelle neue
    </MenuItem>
  </ContextMenu>

TpopmassnFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopmassnFolder
