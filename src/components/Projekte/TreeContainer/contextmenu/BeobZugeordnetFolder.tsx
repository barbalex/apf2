import { useAtomValue } from 'jotai'

import { mapActiveApfloraLayersAtom } from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

// create objects outside render
const showBeobOnMapData = {
  action: 'showBeobOnMap',
  actionTable: 'beobZugeordnet',
  idTable: 'ap',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const BeobZugeordnetFolder = ({ onClick }: Props) => {
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
