// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(inject('store'), observer)

const Apfolder = ({
  onClick,
  tree,
  store
}: {
  onClick: () => void,
  tree: Object,
  store: Object
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}apFolder`}>
      <div className="react-contextmenu-title">Aktionsplan</div>
      {
        !userIsReadOnly(store.user.token) &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'ap',
          }}
        >
          erstelle neuen
        </MenuItem>
      }
      <MenuItem
        onClick={onClick}
        data={{
          action: 'openLowerNodes',
        }}
      >
        alle öffnen
      </MenuItem>
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(Apfolder)
