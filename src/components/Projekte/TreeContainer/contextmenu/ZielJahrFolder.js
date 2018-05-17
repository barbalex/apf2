// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { inject } from 'mobx-react'
import compose from 'recompose/compose'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const enhance = compose(inject('store'))

const ZielJahrFolder = ({
  onClick,
  tree,
  store
}: {
  onClick: () => void,
  tree: Object,
  store: Object
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}zieljahr`}>
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
        !userIsReadOnly(store.user.token) &&
        <Fragment>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'ziel',
            }}
          >
            erstelle neues
          </MenuItem>
        </Fragment>
      }
    </ContextMenu>
  </ErrorBoundary>
)

export default enhance(ZielJahrFolder)
