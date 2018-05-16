// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(inject('store'))

const ZielFolder = ({
  onClick,
  tree,
  store
}: {
  onClick: () => void,
  tree: Object,
  store: Object
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}zieljahrFolder`}>
      <div className="react-contextmenu-title">Ziele</div>
      <MenuItem
        onClick={onClick}
        data={{
          action: 'openLowerNodes',
        }}
      >
        alle öffnen
      </MenuItem>
      {
        !store.user.readOnly &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'ziel',
          }}
        >
          erstelle neues
        </MenuItem>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(ZielFolder)
