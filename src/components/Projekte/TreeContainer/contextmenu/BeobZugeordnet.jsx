import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { userIsReadOnly } from '../../../../modules/userIsReadOnly.js'
import { MobxContext } from '../../../../mobxContext.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import {
  ContextMenu,
  MenuItem,
} from '../../../../modules/react-contextmenu/index.js'

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

export const BeobZugeordnet = memo(
  observer(({ onClick }) => {
    const { user } = useContext(MobxContext)

    return (
      <ErrorBoundary>
        <ContextMenu
          id="treeBeobZugeordnet"
          hideOnLeave={true}
        >
          <div className="react-contextmenu-title">Beobachtung</div>
          {!userIsReadOnly(user.token) && (
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
  }),
)
