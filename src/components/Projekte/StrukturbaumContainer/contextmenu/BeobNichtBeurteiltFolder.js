// @flow
import React, { PropTypes } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const BeobNichtBeurteiltFolder = ({ onClick }:{onClick:() => void}) =>
  <ContextMenu id="beobzuordnungFolder" >
    <div className="react-contextmenu-title">Nicht beurteilte Beobachtungen</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showBeobNichtBeurteiltOnMap`,
        actionTable: `beobNichtBeurteilt`,
        idTable: `ap`,
      }}
    >
      auf Karte zeigen
    </MenuItem>
  </ContextMenu>

BeobNichtBeurteiltFolder.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default BeobNichtBeurteiltFolder
