// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Tpopmassnber = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopmassnber" >
    <div className="react-contextmenu-title" style={{ width: `180px` }}>Massnahmen-Bericht</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopmassnber`,
      }}
    >
      neu
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `delete`,
        table: `tpopmassnber`,
      }}
    >
      löschen
    </MenuItem>
  </ContextMenu>

Tpopmassnber.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default Tpopmassnber
