// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const BeobNichtBeurteilt = (
  {
    tree,
    onClick,
  }:
  {
    tree: Object,
    onClick: () => void,
  }
) =>
  <ContextMenu
    id={`${tree.name}beobzuordnung`}
  >
    <div className="react-contextmenu-title">Beobachtung</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `createNewPopFromBeob`,
      }}
    >
      neue Population und Teil-Population gründen und Beobachtung der Teil-Population zuordnen
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showCoordOfBeobOnMapsZhCh`,
      }}
    >
      Zeige auf maps.zh.ch
    </MenuItem>
    <MenuItem
      onClick={onClick}
      data={{
        action: `showCoordOfBeobOnMapGeoAdminCh`,
      }}
    >
      Zeige auf map.geo.admin.ch
    </MenuItem>
  </ContextMenu>

export default BeobNichtBeurteilt
