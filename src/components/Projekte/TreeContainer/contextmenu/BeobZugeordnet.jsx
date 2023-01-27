import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

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

const BeobZugeordnet = ({ onClick }) => {
  const { user } = useContext(storeContext)

  return (
    <ErrorBoundary>
      <ContextMenu id="treeBeobZugeordnet" hideOnLeave={true}>
        <div className="react-contextmenu-title">Beobachtung</div>
        {!userIsReadOnly(user.token) && (
          <MenuItem onClick={onClick} data={copyBeobZugeordnetKoordToTpopData}>
            Koordinaten auf die Teilpopulation übertragen
          </MenuItem>
        )}
        <MenuItem onClick={onClick} data={showCoordOfBeobOnMapsZhChData}>
          Zeige auf maps.zh.ch
        </MenuItem>
        <MenuItem onClick={onClick} data={showCoordOfBeobOnMapGeoAdminChData}>
          Zeige auf map.geo.admin.ch
        </MenuItem>
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(BeobZugeordnet)
