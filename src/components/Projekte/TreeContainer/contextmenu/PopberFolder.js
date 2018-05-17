// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(inject('store'))

const PopberFolder = ({
  onClick,
  tree,
  store
}: {
  onClick: () => void,
  tree: Object,
  store: Object
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}popberFolder`}>
      <div className="react-contextmenu-title">Kontroll-Berichte</div>
      {
        !userIsReadOnly(store.user.token) &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'popber',
          }}
        >
          erstelle neuen
        </MenuItem>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(PopberFolder)
