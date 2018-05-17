// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(inject('store'), observer)

const BeobNichtBeurteilt = ({
  tree,
  onClick,
  store
}: {
  tree: Object,
  onClick: () => void,
  store: Object
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}beobzuordnung`}>
      <div className="react-contextmenu-title">Beobachtung</div>
      {
        !userIsReadOnly(store.user.token) &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'createNewPopFromBeob',
          }}
        >
          neue Population und Teil-Population gründen und Beobachtung der
          Teil-Population zuordnen
        </MenuItem>
      }
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

export default enhance(BeobNichtBeurteilt)
