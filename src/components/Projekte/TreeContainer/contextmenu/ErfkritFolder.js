// @flow
import React from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'

const enhance = compose(inject('store'))

const ErfkritFolder = ({
  onClick,
  tree,
  store
}: {
  onClick: () => void,
  tree: Object,
  store: Object
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}erfkritFolder`}>
      <div className="react-contextmenu-title">AP-Erfolgskriterien</div>
      {
        !store.user.readOnly &&
        <MenuItem
          onClick={onClick}
          data={{
            action: 'insert',
            table: 'erfkrit',
          }}
        >
          erstelle neues
        </MenuItem>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(ErfkritFolder)
