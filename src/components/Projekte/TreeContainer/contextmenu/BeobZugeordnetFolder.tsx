import { useAtomValue } from 'jotai'

import { mapActiveApfloraLayersAtom } from '../../../../store/index.ts'
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
  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)

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
