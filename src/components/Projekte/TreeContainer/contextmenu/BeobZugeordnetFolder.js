import React, { useContext, useState, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import ErrorBoundary from 'react-error-boundary'

import storeContext from '../../../../storeContext'

// create objects outside render
const showBeobOnMapData = {
  action: 'showBeobOnMap',
  actionTable: 'beobZugeordnet',
  idTable: 'ap',
}

const BeobZugeordnetFolder = ({ treeName, onClick }) => {
  const store = useContext(storeContext)
  const { activeApfloraLayers } = store

  // eslint-disable-next-line no-unused-vars
  const [id, changeId] = useState(0)

  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  const onShow = useCallback(event => {
    changeId(event.detail.data.nodeId)
  })

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${treeName}beobZugeordnetFolder`}
        collect={props => props}
        onShow={onShow}
      >
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
