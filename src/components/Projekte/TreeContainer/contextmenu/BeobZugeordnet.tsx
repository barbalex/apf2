import { useAtomValue } from 'jotai'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.ts'
import { userTokenAtom } from '../../../../store/index.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.ts'

import type { MenuItemProps } from '../../../../modules/react-contextmenu/MenuItem.tsx'

// create objects outside render
const copyBeobZugeordnetKoordToTpopData = {
  action: 'copyBeobZugeordnetKoordToTpop',
}
const showCoordOfBeobOnMapsZhChData = {
  action: 'showCoordOfBeobOnMapsZhCh',
}
const showCoordOfBeobOnMapGeoAdminChData = {
  action: 'showCoordOfBeobOnMapGeoAdminCh',
}

interface Props {
  onClick: NonNullable<MenuItemProps['onClick']>
}

export const BeobZugeordnet = ({ onClick }: Props) => {
  const userToken = useAtomValue(userTokenAtom)

  return (
    <ErrorBoundary>
      <ContextMenu
        id="treeBeobZugeordnet"
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">Beobachtung</div>
        {!userIsReadOnly(userToken) && (
          <MenuItem
            onClick={onClick}
            data={copyBeobZugeordnetKoordToTpopData}
          >
            Koordinaten auf die Teilpopulation übertragen
          </MenuItem>
        )}
        <MenuItem
          onClick={onClick}
          data={showCoordOfBeobOnMapsZhChData}
        >
          Zeige auf maps.zh.ch
        </MenuItem>
        <MenuItem
          onClick={onClick}
          data={showCoordOfBeobOnMapGeoAdminChData}
        >
          Zeige auf map.geo.admin.ch
        </MenuItem>
      </ContextMenu>
    </ErrorBoundary>
  )
}
