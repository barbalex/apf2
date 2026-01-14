import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

// create objects outside render
const showBeobOnMapData = {
  action: 'showBeobOnMap',
  actionTable: 'beobZugeordnet',
  idTable: 'ap',
}

export const BeobZugeordnetFolder = observer(({ onClick }) => {
  const store = useContext(MobxContext)
  const { activeApfloraLayers } = store

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeBeobZugeordnetFolder"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Beobachtungen</div>
        <MenuItem
          onClick={onClick}
          data={showBeobOnMapData}
        >
          {`blende auf Karte ${
            activeApfloraLayers.includes('beobZugeordnet') ? 'aus' : 'ein'
          }`}
        </MenuItem>
      </ContextMenu>
    </ErrorBoundary>
  )
})
