import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Popmassnber = ({ onClick }) =>
  <ContextMenu id="popmassnber" >
    <div className="react-contextmenu-title" style={{ width: `180px` }}>Massnahmen-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `popmassnber`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `popmassnber`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Popmassnber.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Popmassnber
