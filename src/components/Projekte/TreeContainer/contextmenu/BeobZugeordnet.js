// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(inject('store'), observer)

const BeobZugeordnet = ({
  tree,
  onClick,
  store
}: {
  tree: Object,
  onClick: () => void,
  store: Object
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}beobZugeordnet`}>
      <div className="react-contextmenu-title">Beobachtung</div>
      {
        !store.user.readOnly &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'copyBeobZugeordnetKoordToPop',
          }}
        >
          Koordinaten auf die Teilpopulation übertragen
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

export default enhance(BeobZugeordnet)
