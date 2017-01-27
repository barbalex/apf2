import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const ZielBerFolder = ({ onClick }) =>
  <ContextMenu id="zielberFolder" >
    <div className="react-contextmenu-title">Berichte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `zielber`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

ZielBerFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ZielBerFolder
