import React, { useContext } from 'react'

import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu'

// create objects outside render
const showBeobOnMapData = {
  action: 'showBeobOnMap',
  actionTable: 'beobZugeordnet',
  idTable: 'ap',
}

const BeobZugeordnetFolder = ({ treeName, onClick }) => {
  const store = useContext(storeContext)
  const { activeApfloraLayers } = store

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}beobZugeordnetFolder`}>
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
