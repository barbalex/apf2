// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const AssozartFolder = ({
  onClick,
  tree,
  token
}: {
  onClick: () => void,
  tree: Object,
  token: String
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}assozart`}>
      <div className="react-contextmenu-title">assoziierte Art</div>
      {
        !userIsReadOnly(token) &&
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

export default AssozartFolder
