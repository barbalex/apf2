// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

const Tpopbeob = (
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
    id={`${tree.name}tpopbeob`}
  >
    <div className="react-contextmenu-title">Beobachtung</div>
    <MenuItem
      onClick={onClick}
      data={{
        action: `copyTpopBeobKoordToPop`,
      }}
    >
      Koordinaten auf die Teilpopulation übertragen
    </MenuItem>
  </ContextMenu>

export default Tpopbeob
