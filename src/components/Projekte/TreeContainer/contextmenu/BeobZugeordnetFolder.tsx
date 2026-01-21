import { useAtomValue } from 'jotai'

import { activeApfloraLayersAtom } from '../../../../JotaiStore/index.ts'
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

export const BeobZugeordnetFolder = ({ onClick }) => {
  const activeApfloraLayers = useAtomValue(activeApfloraLayersAtom)

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
}
