// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const Tpopbeob = ({ tree, onClick }: { tree: Object, onClick: () => void }) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}tpopbeob`}>
      <div className="react-contextmenu-title">Beobachtung</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'copyTpopBeobKoordToPop',
        }}
      >
        Koordinaten auf die Teilpopulation übertragen
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'showCoordOfBeobOnMapsZhCh',
        }}
      >
        Zeige auf maps.zh.ch
      </MenuItem>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'showCoordOfBeobOnMapGeoAdminCh',
        }}
      >
        Zeige auf map.geo.admin.ch
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default Tpopbeob
