// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopberFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopberFolder" >
    <div className="react-contextmenu-title">Kontroll-Berichte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopber`,
      }}
    >
      erstelle neuen
    </MenuItem>
  </ContextMenu>

TpopberFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopberFolder
