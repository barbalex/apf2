// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopfreiwkontrzaehlFolder = (
  { onClick, treeName }:
  {onClick:()=>void,treeName:string}
) =>
  <ContextMenu id={`${treeName}tpopfreiwkontrzaehlFolder`} >
    <div className="react-contextmenu-title">Zählungen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopfreiwkontrzaehl`,
      }}
    >
      erstelle neue
    </MenuItem>
  </ContextMenu>

TpopfreiwkontrzaehlFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopfreiwkontrzaehlFolder
