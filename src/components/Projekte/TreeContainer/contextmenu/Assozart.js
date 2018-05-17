// @flow
import React, { Fragment } from 'react'
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
    <ContextMenu id={`${tree.name}assozart`}>
      <div className="react-contextmenu-title">assoziierte Art</div>
      {
        !userIsReadOnly(store.user.token) &&
        <Fragment>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'assozart',
            }}
          >
            erstelle neue
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'delete',
              table: 'assozart',
            }}
          >
            lösche
          </MenuItem>
        </Fragment>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(AssozartFolder)
