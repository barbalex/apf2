import React, { useContext } from 'react'

import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

// create objects outside render
const showBeobOnMapData = {
  action: 'showBeobOnMap',
  actionTable: 'beobZugeordnet',
  idTable: 'ap',
}

const BeobZugeordnetFolder = ({ onClick }) => {
  const store = useContext(storeContext)
  const { activeApfloraLayers } = store

  return (
    <ErrorBoundary>
      <ContextMenu id="treeBeobZugeordnetFolder" hideOnLeave={true}>
        <div className="react-contextmenu-title">Beobachtungen</div>
        <MenuItem onClick={onClick} data={showBeobOnMapData}>
          {`blende auf Karte ${
            activeApfloraLayers.includes('beobZugeordnet') ? 'aus' : 'ein'
          }`}
        </MenuItem>
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default BeobZugeordnetFolder
