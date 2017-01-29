// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const TpopmassnberFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="tpopmassnberFolder" >
    <div className="react-contextmenu-title" style={{ width: `185px` }}>Massnahmen-Berichte</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `insert`,
        table: `tpopmassnber`,
      }}
    >
      neu
    </MenuItem>
  </ContextMenu>

TpopmassnberFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default TpopmassnberFolder
