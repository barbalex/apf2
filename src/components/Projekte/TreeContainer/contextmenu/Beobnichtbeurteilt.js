// @flow
import React, { useContext } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { observer } from 'mobx-react-lite'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'
import mobxStoreContext from '../../../../mobxStoreContext'

const BeobNichtBeurteilt = ({
  tree,
  onClick,
  token,
}: {
  tree: Object,
  onClick: () => void,
  token: String,
}) => {
  const { user } = useContext(mobxStoreContext)

  return (
    <ErrorBoundary>
      <ContextMenu id={`${tree.name}beobNichtBeurteilt`}>
        <div className="react-contextmenu-title">Beobachtung</div>
        {!userIsReadOnly(user.token) && (
          <MenuItem
            onClick={onClick}
            data={{
              action: 'createNewPopFromBeob',
            }}
          >
            neue Population und Teil-Population gründen und Beobachtung der
            Teil-Population zuordnen
          </MenuItem>
        )}
        <MenuItem
          onClick={onClick}
          data={{
            action: 'showCoordOfBeobOnMapsZhCh',
          }}
        >
          Zeige auf maps.zh.ch
        </MenuItem>
        <MenuItem
          onClick={onClick}
          data={{
            action: 'showCoordOfBeobOnMapGeoAdminCh',
          }}
        >
          Zeige auf map.geo.admin.ch
        </MenuItem>
      </ContextMenu>
    </ErrorBoundary>
  )
}

export default observer(BeobNichtBeurteilt)
