// @flow
import React, { Fragment } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'

import ErrorBoundary from '../../../shared/ErrorBoundary'
import userIsReadOnly from '../../../../modules/userIsReadOnly'

const EkfzaehleinheitFolder = ({
  onClick,
  tree,
  token,
}: {
  onClick: () => void,
  tree: Object,
  token: String,
}) => (
  <ErrorBoundary>
    <ContextMenu id={`${tree.name}ekfzaehleinheit`}>
      <div className="react-contextmenu-title">EKF-Zähleinheit</div>
      {!userIsReadOnly(token) && (
        <Fragment>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'insert',
              table: 'ekfzaehleinheit',
            }}
          >
            erstelle neue
          </MenuItem>
          <MenuItem
            onClick={onClick}
            data={{
              action: 'delete',
              table: 'ekfzaehleinheit',
            }}
          >
            lösche
          </MenuItem>
        </Fragment>
      )}
    </ContextMenu>
  </ErrorBoundary>
)

export default EkfzaehleinheitFolder
