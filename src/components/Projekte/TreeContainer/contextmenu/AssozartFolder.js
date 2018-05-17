// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject, observer } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(inject('store'), observer)

const AssozartFolder = ({
  onClick,
  tree,
  store
}: {
  onClick: () => void,
  tree: Object,
  store: Object
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}assozartFolder`}>
      <div className="react-contextmenu-title">assoziierte Art</div>
      {
        !userIsReadOnly(store.user.token) &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'assozart',
          }}
        >
          erstelle neue
        </MenuItem>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(AssozartFolder)
